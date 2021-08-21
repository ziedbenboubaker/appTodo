import React from "react";
import { ApolloProvider } from "@apollo/client";

import apolloClient from "./apolloClient";
import { HomePage } from "./pages";
import "./App.css";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <HomePage />
    </ApolloProvider>
  );
}

export default App;
