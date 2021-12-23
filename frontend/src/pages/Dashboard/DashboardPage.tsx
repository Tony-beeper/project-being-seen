import { useHistory } from "react-router-dom";
import { decodeAuthToken } from "utils/authHelpers";
import UserRoles from "utils/UserRoles";
import DonorDashboard from "components/Dashboard/Donor";
import YouthDashboard from "components/Dashboard/Youth";
import MerchantDashboard from "components/Dashboard/Merchant";

// Render the dashboard page of the application. If a user is not logged in (or
// do not have a role we recognize), we redirect them to the homepage.
const DashboardPage = () => {
  const history = useHistory();
  const account = decodeAuthToken();

  switch (account && account.role) {
    case UserRoles.merchant:
      return <MerchantDashboard />;
    case UserRoles.donor:
      return <DonorDashboard />;
    case UserRoles.youth:
      return <YouthDashboard />;
    default:
      history.push("/");
      return null;
  }
};

export default DashboardPage;
