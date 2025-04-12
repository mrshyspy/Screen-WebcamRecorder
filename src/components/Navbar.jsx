import React from "react";

const Navbar = () => {
  return (
    <div className="flex flex-row justify-between mx-16">
      <div className="">Recodek</div>
      <div className=" flex flex-row gap-16 ">
        <div>Home</div>
        <div>About</div>
        <div>Pricing</div>
      </div>
    </div>
  );
};

export default Navbar;
