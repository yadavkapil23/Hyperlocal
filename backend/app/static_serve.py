# Serve React frontend from Flask backend
from flask import send_from_directory, send_file
import os

def serve_frontend():
    """Serve React frontend files"""
    frontend_path = os.path.join(os.path.dirname(__file__), '..', '..', 'frontend', 'dist')
    
    if not os.path.exists(frontend_path):
        return "Frontend not built", 404
    
    return send_from_directory(frontend_path, 'index.html')

def serve_static(filename):
    """Serve static assets (CSS, JS, images)"""
    frontend_path = os.path.join(os.path.dirname(__file__), '..', '..', 'frontend', 'dist')
    return send_from_directory(frontend_path, filename)
