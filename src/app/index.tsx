//./pages/index.tsx

import React, { memo, useState } from "react";
import Autocomplete from "@/components/Autocomplete";

const IndexPage = () => {
  const [value, setValue] = useState("");
  //a list of countries to show the dropdown
  const countries = ["Africa", "Armenia", "Canada", "United States"];
  return (
    <div className="container mx-auto px-4">
      <div className="py-10">
        <Autocomplete value={value} onChange={setValue} items={countries} />
      </div>
    </div>
  );
};

export default memo(IndexPage);

