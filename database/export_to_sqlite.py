"""
MySQL → SQLite Export Script
Exports the bookstore_db MySQL database to a SQLite file
that can be uploaded to Turso.
"""

import os
import sqlite3
import sys

try:
    import pymysql
except ImportError:
    print("ERROR: pymysql not found. Run: pip install pymysql")
    sys.exit(1)

# ─── CONFIG ───────────────────────────────────────────────────────────────────
MYSQL_HOST     = os.environ.get("DB_HOST", "127.0.0.1")
MYSQL_PORT     = int(os.environ.get("DB_PORT", "3306"))
MYSQL_USER     = os.environ.get("DB_USERNAME", "root")
MYSQL_PASSWORD = os.environ.get("DB_PASSWORD", "Port3405@.Af")
MYSQL_DB       = os.environ.get("DB_NAME", "bookstore_db")

BASE_DIR       = os.path.dirname(os.path.abspath(__file__))
SQLITE_FILE    = os.path.join(BASE_DIR, "bookstore_db.sqlite")
# ──────────────────────────────────────────────────────────────────────────────

# Tables in dependency order (parent tables first)
TABLE_ORDER = [
    "users",
    "categories",
    "books",
    "carts",
    "cart_items",
    "orders",
    "order_items",
]

# MySQL → SQLite type mapping
def map_type(mysql_type: str) -> str:
    t = mysql_type.upper()
    if any(x in t for x in ("INT", "TINYINT", "SMALLINT", "MEDIUMINT", "BIGINT")):
        return "INTEGER"
    if any(x in t for x in ("DECIMAL", "NUMERIC", "FLOAT", "DOUBLE", "REAL")):
        return "REAL"
    if any(x in t for x in ("BLOB", "BINARY", "VARBINARY")):
        return "BLOB"
    return "TEXT"


def get_mysql_connection():
    return pymysql.connect(
        host=MYSQL_HOST,
        port=MYSQL_PORT,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DB,
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
    )


def get_create_statement(mysql_cur, table: str) -> str:
    """Build a CREATE TABLE statement for SQLite from MySQL column info."""
    mysql_cur.execute(
        "SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY, EXTRA "
        "FROM information_schema.COLUMNS "
        "WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s "
        "ORDER BY ORDINAL_POSITION",
        (MYSQL_DB, table),
    )
    columns = mysql_cur.fetchall()

    # Fetch foreign keys
    mysql_cur.execute(
        "SELECT COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME "
        "FROM information_schema.KEY_COLUMN_USAGE "
        "WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s "
        "AND REFERENCED_TABLE_NAME IS NOT NULL",
        (MYSQL_DB, table),
    )
    fks = {row["COLUMN_NAME"]: row for row in mysql_cur.fetchall()}

    col_defs = []
    for col in columns:
        name    = col["COLUMN_NAME"]
        sqlite_t = map_type(col["DATA_TYPE"])
        nullable = col["IS_NULLABLE"] == "YES"
        pk       = col["COLUMN_KEY"] == "PRI"
        ai       = "auto_increment" in (col["EXTRA"] or "").lower()

        parts = [f'"{name}" {sqlite_t}']
        if pk and ai:
            parts.append("PRIMARY KEY AUTOINCREMENT")
        elif pk:
            parts.append("PRIMARY KEY")

        if not nullable and not pk:
            parts.append("NOT NULL")

        # Foreign key inline reference (added as constraint below instead)
        col_defs.append(" ".join(parts))

    # Add FK constraints
    for col_name, fk in fks.items():
        col_defs.append(
            f'FOREIGN KEY ("{col_name}") '
            f'REFERENCES "{fk["REFERENCED_TABLE_NAME"]}"("{fk["REFERENCED_COLUMN_NAME"]}")'
        )

    return f'CREATE TABLE IF NOT EXISTS "{table}" (\n  ' + ",\n  ".join(col_defs) + "\n);"


def export():
    print(f"Connecting to MySQL [{MYSQL_DB}] ...")
    mysql_conn = get_mysql_connection()
    mysql_cur  = mysql_conn.cursor()

    print(f"Opening SQLite file: {SQLITE_FILE}")
    sqlite_conn = sqlite3.connect(SQLITE_FILE)
    sqlite_conn.execute("PRAGMA foreign_keys = ON;")
    sqlite_conn.execute("PRAGMA journal_mode = WAL;")
    sqlite_cur = sqlite_conn.cursor()

    # Determine which tables actually exist in MySQL
    mysql_cur.execute(
        "SELECT TABLE_NAME FROM information_schema.TABLES "
        "WHERE TABLE_SCHEMA = %s AND TABLE_TYPE = 'BASE TABLE'",
        (MYSQL_DB,),
    )
    existing = {row["TABLE_NAME"] for row in mysql_cur.fetchall()}

    tables_to_export = [t for t in TABLE_ORDER if t in existing]
    # Append any tables not in our ordered list
    for t in existing:
        if t not in tables_to_export:
            tables_to_export.append(t)

    print(f"\nTables found: {', '.join(tables_to_export)}\n")

    for table in tables_to_export:
        print(f"  → Exporting table: {table}")

        # Build & execute CREATE TABLE
        create_sql = get_create_statement(mysql_cur, table)
        try:
            sqlite_cur.execute(create_sql)
        except sqlite3.OperationalError as e:
            print(f"    WARNING creating table {table}: {e}")

        # Fetch all rows
        mysql_cur.execute(f"SELECT * FROM `{table}`")
        rows = mysql_cur.fetchall()

        if not rows:
            print(f"    (empty table)")
            continue

        # Build INSERT
        col_names = list(rows[0].keys())
        placeholders = ", ".join(["?"] * len(col_names))
        col_list = ", ".join([f'"{c}"' for c in col_names])
        insert_sql = f'INSERT OR IGNORE INTO "{table}" ({col_list}) VALUES ({placeholders})'

        row_count = 0
        for row in rows:
            values = []
            for v in row.values():
                # Convert enum-like objects or non-primitive types to string
                if v is not None and not isinstance(v, (int, float, str, bytes)):
                    v = str(v)
                values.append(v)
            sqlite_cur.execute(insert_sql, values)
            row_count += 1

        print(f"    ✓ {row_count} row(s) inserted")

    sqlite_conn.commit()
    sqlite_conn.close()
    mysql_cur.close()
    mysql_conn.close()

    print(f"\n✅ Export complete! SQLite file saved as: {SQLITE_FILE}")
    print(f"   Upload this file to Turso using the Turso CLI.")


if __name__ == "__main__":
    export()
