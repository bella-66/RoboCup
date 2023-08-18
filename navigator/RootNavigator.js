import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { AuthContext } from "../context/AuthContext";
import Result from "../screens/results/[id]";
import AddResultScreen from "../screens/AddResultScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import AddTimelineScreen from "../screens/AddTimelineScreen";
import AddSutazScreen from "../screens/AddSutazScreen";
import RegisterTeamScreen from "../screens/RegisterTeamScreen";
import DrawerNavigator from "./DrawerNavigator";
import AddOsobaScreen from "../screens/admin/osoba/AddOsobaScreen";
import OsobaOne from "../screens/admin/osoba/[id]";
import ResultByTeamScreen from "../screens/ResultByTeamScreen";
import Timeline from "../screens/timeline/[id]";
import TeamOne from "../screens/admin/team/[id]";
import AddTeamScreen from "../screens/admin/team/AddTeamScreen";
import OrganizationOne from "../screens/admin/organization/[id]";
import AddOrganizationScreen from "../screens/admin/organization/AddOrganizationScreen";
import Event from "../screens/event/[id]";
import AddEventScreen from "../screens/admin/event/AddEventScreen";
import EventOne from "../screens/admin/event/[id]";
import AddCompetitionScreen from "../screens/admin/competition/AddCompetitionScreen";
import AddResultAdminScreen from "../screens/admin/result/AddResultAdminScreen";
import AddTimelineAdminScreen from "../screens/admin/timeline/AddTimelineAdminScreen";
import CompetitionOne from "../screens/admin/competition/[id]";
import ResultOne from "../screens/admin/result/[id]";
import TimelineOne from "../screens/admin/timeline/[id]";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import EditResultScreen from "../screens/EditResultScreen";
import ListCompsScreen from "../screens/results/ListCompsScreen";
import UserTeamComps from "../screens/UserTeamComps";
import AddTeamToCompScreen from "../screens/admin/team/AddTeamToCompScreen";
import AddCompToTeam from "../screens/admin/competition/AddCompToTeam";

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
  const { userInfo } = useContext(AuthContext);
  return (
    <RootStack.Navigator>
      {!userInfo ? (
        <RootStack.Group>
          <RootStack.Screen
            options={{ headerShown: false }}
            name="Login"
            component={LoginScreen}
          />
          <RootStack.Screen
            options={{ headerShown: false }}
            name="Register"
            component={RegisterScreen}
          />
          <RootStack.Screen
            options={{ headerShown: false }}
            name="RegisterTeam"
            component={RegisterTeamScreen}
          />
          <RootStack.Screen
            options={{ headerShown: false }}
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
          <RootStack.Screen
            options={{ headerShown: false }}
            name="ResetPassword"
            component={ResetPasswordScreen}
          />
        </RootStack.Group>
      ) : userInfo.rola === "Administrator" ? (
        <RootStack.Group>
          <RootStack.Screen
            name="DrawerNavigator"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />
          <RootStack.Screen name="AddOsoba" component={AddOsobaScreen} />
          <RootStack.Screen name="AddTeam" component={AddTeamScreen} />
          <RootStack.Screen
            name="AddTeamToComp"
            component={AddTeamToCompScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="AddCompToTeam"
            component={AddCompToTeam}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="AddOrganization"
            component={AddOrganizationScreen}
          />
          <RootStack.Screen name="AddEvent" component={AddEventScreen} />
          <RootStack.Screen
            name="AddResultAdmin"
            component={AddResultAdminScreen}
          />
          <RootStack.Screen
            name="AddTimelineAdmin"
            component={AddTimelineAdminScreen}
          />
          <RootStack.Screen
            name="AddCompetition"
            component={AddCompetitionScreen}
          />
          <RootStack.Screen name="OsobaOne" component={OsobaOne} />
          <RootStack.Screen name="TeamOne" component={TeamOne} />
          <RootStack.Screen
            name="OrganizationOne"
            component={OrganizationOne}
          />
          <RootStack.Screen name="EventOne" component={EventOne} />
          <RootStack.Screen name="CompetitionOne" component={CompetitionOne} />
          <RootStack.Screen name="ResultOne" component={ResultOne} />
          <RootStack.Screen
            name="EditResult"
            component={EditResultScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen name="TimelineOne" component={TimelineOne} />
          <RootStack.Screen name="EditProfile" component={EditProfileScreen} />
        </RootStack.Group>
      ) : (
        <RootStack.Group>
          <RootStack.Screen name="Main" component={TabNavigator} />
          <RootStack.Screen name="Result" component={Result} />
          <RootStack.Screen
            name="ListComps"
            component={ListCompsScreen}
            options={{
              animation: "fade",
              animationDuration: 800,
            }}
          />
          <RootStack.Screen
            name="Event"
            component={Event}
            options={{
              animation: "slide_from_right",
              animationDuration: 600,
            }}
          />
          <RootStack.Screen
            name="Timeline"
            component={Timeline}
            options={{
              animation: "fade",
              animationDuration: 800,
            }}
          />
          <RootStack.Screen name="EditProfile" component={EditProfileScreen} />

          <RootStack.Screen
            name="AddResult"
            component={AddResultScreen}
            options={{
              headerShown: false,
              animation: "slide_from_bottom",
              animationDuration: 600,
            }}
          />
          <RootStack.Screen
            name="EditResult"
            component={EditResultScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="AddTimeline"
            component={AddTimelineScreen}
            options={{
              headerShown: false,
              animation: "slide_from_bottom",
              animationDuration: 600,
            }}
          />
          <RootStack.Screen
            name="AddSutaz"
            component={AddSutazScreen}
            options={{
              headerShown: false,
              animation: "slide_from_bottom",
              animationDuration: 600,
            }}
          />
          <RootStack.Screen
            name="ResultByTeam"
            component={ResultByTeamScreen}
          />
          <RootStack.Screen name="UserTeamComps" component={UserTeamComps} />
        </RootStack.Group>
      )}
    </RootStack.Navigator>
  );
};

export default RootNavigator;
