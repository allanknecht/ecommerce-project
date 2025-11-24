require "test_helper"

class CouponsControllerTest < ActionDispatch::IntegrationTest
  test "should get apply" do
    get coupons_apply_url
    assert_response :success
  end
end
