import { DrawerActions, useNavigation } from "@react-navigation/native";
import HomeAdminScreen from "../screens/admin/HomeAdminScreen";
import OsobaScreen from "../screens/admin/osoba/OsobaScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ProfileScreen from "../screens/ProfileScreen";
import TeamScreen from "../screens/admin/team/TeamScreen";
import OrganizationScreen from "../screens/admin/organization/OrganizationScreen";
import EventScreen from "../screens/admin/event/EventScreen";
import CompetitionScreen from "../screens/admin/competition/CompetitionScreen";
import ResultScreen from "../screens/admin/result/ResultScreen";
import TimelineScreen from "../screens/admin/timeline/TimelineScreen";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const navigation = useNavigation();
  const openDrawer = () => navigation.dispatch(DrawerActions.toggleDrawer());
  return (
    <Drawer.Navigator
      initialRouteName="HomeAdmin"
      screenOptions={{
        drawerActiveBackgroundColor: "#dbeafe",
        drawerActiveTintColor: "#3b82f6",
      }}
    >
      <Drawer.Screen
        name="HomeAdmin"
        component={HomeAdminScreen}
        options={{ drawerLabel: "Home" }}
      />
      <Drawer.Screen
        name="Osoba"
        component={OsobaScreen}
        options={{ drawerLabel: "Users" }}
      />
      <Drawer.Screen
        name="Teams"
        component={TeamScreen}
        options={{ drawerLabel: "Teams" }}
      />
      <Drawer.Screen
        name="Organizations"
        component={OrganizationScreen}
        options={{ drawerLabel: "Organizations" }}
      />
      <Drawer.Screen
        name="Events"
        component={EventScreen}
        options={{ drawerLabel: "Events" }}
      />
      <Drawer.Screen
        name="Timeline"
        component={TimelineScreen}
        options={{ drawerLabel: "Timeline" }}
      />
      <Drawer.Screen
        name="Competitions"
        component={CompetitionScreen}
        options={{ drawerLabel: "Competitions" }}
      />
      <Drawer.Screen
        name="Results"
        component={ResultScreen}
        options={{ drawerLabel: "Results" }}
      />
      <Drawer.Screen
        name="ProfileAdmin"
        component={ProfileScreen}
        options={{ drawerLabel: "Profile" }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
