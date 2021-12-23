import { useHistory } from "react-router-dom";
import { decodeAuthToken } from "utils/authHelpers";
import UserRoles from "utils/UserRoles";
import DonorProfile from "components/Profile/Donor";
import YouthProfile from "components/Profile/Youth";
import MerchantProfile from "components/Profile/Merchant";

// Render the profile page of the application. If a user is not logged in (or
// do not have a role we recognize), we redirect them to the homepage.
const DashboardPage = () => {
  const history = useHistory();
  const account = decodeAuthToken();

  switch (account && account.role) {
    case UserRoles.merchant:
      return <MerchantProfile />;
    case UserRoles.donor:
      return <DonorProfile />;
    case UserRoles.youth:
      return <YouthProfile />;
    default:
      history.push("/");
      return null;
  }
};

export default DashboardPage;
