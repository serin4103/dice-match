import React from "react";
import Image from "next/image";

const Header: React.FC = () => {

    return (
        <header style={{display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"}}>
            <Image 
                src="/header.svg" 
                alt="Header" 
                width={200} 
                height={50}
            />
        </header>
    );
};

export default Header;
