#!/usr/bin/env python3
"""
Script to seed test events into the database
"""
import os
import sys
from datetime import datetime, timedelta
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Add the app directory to the path
sys.path.append(os.path.abspath("."))

def get_database_url():
    return os.getenv('DATABASE_URL', 'postgresql+psycopg://thirdplace:thirdplace@db:5432/thirdplace')

def seed_events():
    """Create some test events"""
    engine = create_engine(get_database_url())
    Session = sessionmaker(bind=engine)
    
    with Session() as session:
        try:
            # First, let's get a category ID
            category_result = session.execute(text("SELECT id FROM categories LIMIT 1"))
            category_id = category_result.fetchone()
            
            if not category_id:
                print("No categories found. Please run seed_categories.py first.")
                return
            
            category_id = category_id[0]
            print(f"Using category ID: {category_id}")
            
            # Create test events
            test_events = [
                {
                    'title': 'Coffee Meetup at Blue Bottle',
                    'description': 'Join us for a casual coffee chat at Blue Bottle Coffee in Hayes Valley',
                    'category_id': category_id,
                    'starts_at': datetime.now() + timedelta(hours=2),
                    'ends_at': datetime.now() + timedelta(hours=4),
                    'latitude': 37.7749,
                    'longitude': -122.4194,
                    'is_public': True
                },
                {
                    'title': 'Morning Yoga in Golden Gate Park',
                    'description': 'Free yoga session in the park. Bring your own mat!',
                    'category_id': category_id,
                    'starts_at': datetime.now() + timedelta(days=1, hours=8),
                    'ends_at': datetime.now() + timedelta(days=1, hours=10),
                    'latitude': 37.7694,
                    'longitude': -122.4862,
                    'is_public': True
                },
                {
                    'title': 'Tech Talk: AI and Machine Learning',
                    'description': 'Discussion about the latest trends in AI and ML',
                    'category_id': category_id,
                    'starts_at': datetime.now() + timedelta(days=2, hours=18),
                    'ends_at': datetime.now() + timedelta(days=2, hours=20),
                    'latitude': 37.7849,
                    'longitude': -122.4094,
                    'is_public': True
                },
                {
                    'title': 'Food Truck Festival',
                    'description': 'Local food trucks serving delicious street food',
                    'category_id': category_id,
                    'starts_at': datetime.now() + timedelta(days=3, hours=12),
                    'ends_at': datetime.now() + timedelta(days=3, hours=18),
                    'latitude': 37.7849,
                    'longitude': -122.4094,
                    'is_public': True
                },
                {
                    'title': 'Book Club Meeting',
                    'description': 'Discussing "The Great Gatsby" this month',
                    'category_id': category_id,
                    'starts_at': datetime.now() + timedelta(days=5, hours=19),
                    'ends_at': datetime.now() + timedelta(days=5, hours=21),
                    'latitude': 37.7949,
                    'longitude': -122.4094,
                    'is_public': True
                }
            ]
            
            # Insert events
            for event in test_events:
                # Convert to PostGIS point - use string formatting for coordinates
                point_wkt = f"POINT({event['longitude']} {event['latitude']})"
                insert_query = text("""
                    INSERT INTO events (title, description, category_id, starts_at, ends_at, location, is_public)
                    VALUES (:title, :description, :category_id, :starts_at, :ends_at, 
                            ST_GeomFromText(:point_wkt, 4326), :is_public)
                """)
                
                session.execute(insert_query, {
                    'title': event['title'],
                    'description': event['description'],
                    'category_id': event['category_id'],
                    'starts_at': event['starts_at'],
                    'ends_at': event['ends_at'],
                    'point_wkt': point_wkt,
                    'is_public': event['is_public']
                })
            
            session.commit()
            print(f"✅ Successfully created {len(test_events)} test events!")
            
            # Show the created events
            result = session.execute(text("""
                SELECT id, title, starts_at, 
                       ST_X(location::geometry) AS longitude,
                       ST_Y(location::geometry) AS latitude
                FROM events 
                ORDER BY starts_at
            """))
            
            print("\n📅 Created Events:")
            for row in result:
                print(f"  • {row.title} (ID: {row.id}) - {row.starts_at} at ({row.latitude}, {row.longitude})")
                
        except Exception as e:
            print(f"❌ Error creating events: {e}")
            session.rollback()
            raise

if __name__ == "__main__":
    seed_events()
