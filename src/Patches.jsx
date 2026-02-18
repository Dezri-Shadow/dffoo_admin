import React from "react";
import ConsoleLog from "./components/ConsoleLog";
import ExampleButtons from "./components/ExampleButtons";
import Nav from "./components/Nav";

export default function Patches() {
    return (
        <div>
            <Nav/>
            <ExampleButtons/>
            <ConsoleLog/>
        </div>
    );
};