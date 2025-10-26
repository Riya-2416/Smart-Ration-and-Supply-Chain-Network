import requests
import csv
from io import StringIO

# CSV URLs
FAMILY_CSV_URL = "C:\Users\tejal\Downloads\DOC-20251001-WA0005.csv"
MEMBERS_CSV_URL = "C:\Users\tejal\Downloads\family_members.csv"

print("=" * 80)
print("FETCHING FAMILY DATA")
print("=" * 80)

try:
    response = requests.get(FAMILY_CSV_URL)
    response.raise_for_status()
    
    csv_reader = csv.DictReader(StringIO(response.text))
    families = list(csv_reader)
    
    print(f"\nTotal Families: {len(families)}\n")
    
    for i, family in enumerate(families, 1):
        print(f"Family {i}:")
        print(f"  Family ID: {family.get('family_id', 'N/A')}")
        print(f"  Head Name: {family.get('head_name', 'N/A')}")
        print(f"  Age: {family.get('head_age', 'N/A')}")
        print(f"  Gender: {family.get('head_gender', 'N/A')}")
        print(f"  Mobile: {family.get('head_mobile', 'N/A')}")
        print(f"  Aadhaar: {family.get('head_aadhaar_number', 'N/A')}")
        print(f"  Ration Card: {family.get('ration_card_number', 'N/A')}")
        print(f"  Card Type: {family.get('ration_card_type', 'N/A')}")
        print(f"  Address: {family.get('address', 'N/A')}")
        print(f"  Family Members: {family.get('family_members', 'N/A')}")
        print()
        
except Exception as e:
    print(f"Error fetching family data: {e}")

print("=" * 80)
print("FETCHING FAMILY MEMBERS DATA")
print("=" * 80)

try:
    response = requests.get(MEMBERS_CSV_URL)
    response.raise_for_status()
    
    csv_reader = csv.DictReader(StringIO(response.text))
    members = list(csv_reader)
    
    print(f"\nTotal Members: {len(members)}\n")
    
    # Group members by family
    from collections import defaultdict
    members_by_family = defaultdict(list)
    
    for member in members:
        family_id = member.get('family_id', 'N/A')
        members_by_family[family_id].append(member)
    
    for family_id, family_members in sorted(members_by_family.items()):
        print(f"Family ID {family_id} Members:")
        for member in family_members:
            print(f"  - {member.get('name', 'N/A')} ({member.get('relation_to_head', 'N/A')})")
            print(f"    Age: {member.get('age', 'N/A')}, Gender: {member.get('gender', 'N/A')}")
            print(f"    Aadhaar: {member.get('aadhaar_number', 'N/A')}")
            print(f"    Status: {member.get('status', 'N/A')}")
        print()
        
except Exception as e:
    print(f"Error fetching members data: {e}")

print("=" * 80)
print("DATA VERIFICATION COMPLETE")
print("=" * 80)
