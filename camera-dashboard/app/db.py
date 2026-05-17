"""
Database initialization and connection management.
"""
import sqlite3
import os
from flask import g, current_app


def get_db():
    """
    Get the database connection for the current application context.
    Creates a connection if one does not exist.

    Returns:
        sqlite3.Connection: Database connection with row factory set to access columns by name.
    """
    if 'db' not in g:
        db_path = current_app.config.get('DATABASE')
        g.db = sqlite3.connect(db_path)
        g.db.row_factory = sqlite3.Row
    return g.db


def close_db(e=None):
    """
    Close the database connection when the app context ends.

    Args:
        e (Exception, optional): Exception from app teardown (if any).
    """
    db = g.pop('db', None)
    if db is not None:
        db.close()


def init_db():
    """
    Initialize the database schema by reading and executing schema.sql.
    Creates the cameras table if it doesn't exist.
    """
    db = get_db()

    schema_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        'schema.sql'
    )

    with open(schema_path, 'r') as f:
        schema = f.read()

    db.executescript(schema)
    db.commit()
