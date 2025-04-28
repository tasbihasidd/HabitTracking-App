import requests
import sys
from datetime import datetime

class HabitGrowAPITester:
    def __init__(self, base_url="https://7f1acaee-09fd-48d5-bc0c-42058d90b420.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.created_status_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                if response.text:
                    try:
                        print(f"Response: {response.json()}")
                    except:
                        print(f"Response: {response.text}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                if response.text:
                    try:
                        print(f"Error: {response.json()}")
                    except:
                        print(f"Error: {response.text}")

            return success, response

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, None

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test(
            "Root API Endpoint",
            "GET",
            "api",
            200
        )

    def test_create_status_check(self):
        """Test creating a status check"""
        client_name = f"test_client_{datetime.now().strftime('%H%M%S')}"
        success, response = self.run_test(
            "Create Status Check",
            "POST",
            "api/status",
            200,
            data={"client_name": client_name}
        )
        
        if success and response and response.json():
            self.created_status_id = response.json().get('id')
            
        return success, response

    def test_get_status_checks(self):
        """Test getting all status checks"""
        return self.run_test(
            "Get Status Checks",
            "GET",
            "api/status",
            200
        )
        
    def test_error_handling(self):
        """Test error handling with invalid data"""
        return self.run_test(
            "Error Handling - Missing Required Field",
            "POST",
            "api/status",
            422,  # Expecting validation error
            data={}  # Missing required client_name field
        )
        
    def test_api_performance(self):
        """Test API performance with multiple requests"""
        print("\n🔍 Testing API Performance...")
        start_time = datetime.now()
        
        # Make 5 requests in sequence
        for i in range(5):
            self.test_create_status_check()
            
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        avg_response_time = duration / 5
        
        print(f"Average response time: {avg_response_time:.2f} seconds")
        
        # Consider test passed if average response time is under 1 second
        success = avg_response_time < 1.0
        if success:
            self.tests_passed += 1
            print("✅ Performance test passed")
        else:
            print("❌ Performance test failed - response time too slow")
            
        self.tests_run += 1
        return success

def main():
    # Setup
    tester = HabitGrowAPITester()
    
    # Run tests
    print("\n===== TESTING HABITGROW API =====")
    print(f"Base URL: {tester.base_url}")
    
    # Basic API tests
    root_success, _ = tester.test_root_endpoint()
    create_success, _ = tester.test_create_status_check()
    get_success, _ = tester.test_get_status_checks()
    
    # Advanced tests
    error_success, _ = tester.test_error_handling()
    performance_success = tester.test_api_performance()

    # Print results
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    
    if tester.tests_passed == tester.tests_run:
        print("\n✅ All backend API tests passed successfully!")
    else:
        print(f"\n❌ {tester.tests_run - tester.tests_passed} tests failed")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())