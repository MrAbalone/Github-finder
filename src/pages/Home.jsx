import React from "react";
import UserResults from "../components/User/UserResults";
import UserSearch from "../components/User/UserSearch";
function Home() {
  return (
    <div>
      <UserSearch />
      <UserResults />
    </div>
  );
}

export default Home;
