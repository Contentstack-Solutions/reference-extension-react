import { Button, TextInput, Select } from "@contentstack/venus-components";
import VTable from "./components/vTable";
import { useState, useEffect } from "react";
import "./App.css";
import React from "react";
import "reactjs-popup/dist/index.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState({});
  const [filteredData, setfData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [vvalue, updateVValue] = useState(null);

  useEffect(() => {
    const Fetchdata = () => {
      fetch(
        `https://cdn.contentstack.io/v3/content_types/blog/entries?environment=dev&locale=en-us&include_fallback=true`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            api_key: "blta617665c36cf7ddc",
            access_token: "cs25079a785563c044a1609e3d",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setData(data.entries);
          setfData(data.entries);
          console.log(data.entries);
          setLoading(false);
        });
    };
    Fetchdata();
  }, []);

  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

  if (!data) {
    return <div className="App">Loading...</div>;
  }

  if (!filteredData) {
    return <div className="App">Loading...</div>;
  }

  function searching(i, query, param) {
    console.log(i, query, param);
    if (param === "select") {
      return i;
    }

    if (param !== "tags" && param !== "select") {
      if (i[param].toLowerCase().search(query.toLowerCase()) > -1) {
        return i;
      }
    }

    if (param === "tags") {
      if (i[param].join().toLowerCase().search(query.toLowerCase()) > -1) {
        return i;
      }
    }
  }

  function finalize() {
    if (vvalue == null) {
      setfData(data);
    }

    if (vvalue !== null) {
      setfData(data.filter((i) => searching(i, query, vvalue.value)));
    }
  }

  function clear() {
    setfData(data);
    updateVValue(null);
    setQuery("");
  }

  const handleValueUpdate = (data) => {
    updateVValue(data);

    if (data == null) {
      setQuery("");
      finalize();
    }
  };
  return (
    <div className="container-1">
      <div className="row">
        <form>
          <TextInput
            type="text"
            value={query}
            placeholder="Query..."
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
        </form>

        <Select
          hideSelectedOptions
          maxMenuHeight={200}
          isClearable={true}
          noOptionsMessage={function noRefCheck() {}}
          onChange={handleValueUpdate}
          options={[
            {
              id: 0,
              label: "Title",
              value: "title",
            },
            {
              id: 1,
              label: "Author",
              value: "author",
            },
            {
              id: 2,
              label: "Biography",
              value: "biography",
            },
            {
              id: 3,
              label: "Occupation",
              value: "occupation",
            },
            {
              id: 4,
              label: "UID",
              value: "uid",
            },
            {
              id: 5,
              label: "Tags",
              value: "tags",
            },
          ]}
          placeholder="All"
          // selectLabel="Select"
          value={vvalue}
          width="200px"
        />
        <Button onClick={finalize}>Search</Button>
        <Button buttonType={"secondary"} onClick={clear}>
          Clear
        </Button>
      </div>

      {/* <Table filteredData={filteredData}></Table> */}

      <div className="vtable">
        <VTable filteredData={filteredData} />
      </div>
    </div>
  );
}

//   return (
//     <div className="container-1">
//       <div className="row">
//         <form>
//           <TextInput
//             type="text"
//             value={query}
//             placeholder="Query..."
//             onChange={(e) => {
//               setQuery(e.target.value);
//             }}
//           />
//         </form>

//         <Select
//           hideSelectedOptions
//           maxMenuHeight={200}
//           isClearable={true}
//           noOptionsMessage={function noRefCheck() {}}
//           onChange={handleValueUpdate}
//           options={[
//             {
//               id: 0,
//               label: "Title",
//               value: "title",
//             },
//             {
//               id: 1,
//               label: "Author",
//               value: "author",
//             },
//             {
//               id: 2,
//               label: "Biography",
//               value: "biography",
//             },
//             {
//               id: 3,
//               label: "Occupation",
//               value: "occupation",
//             },
//             {
//               id: 4,
//               label: "UID",
//               value: "uid",
//             },
//             {
//               id: 5,
//               label: "Tags",
//               value: "tags",
//             },
//           ]}
//           placeholder="All"
//           // selectLabel="Select"
//           value={vvalue}
//           width="200px"
//         />
//         <Button onClick={finalize}>Search</Button>
//         <Button buttonType={"secondary"} onClick={clear}>
//           Clear
//         </Button>
//       </div>

//       {/* <Table filteredData={filteredData}></Table> */}

//       <div className="vtable">
//         <VTable filteredData={filteredData} />
//       </div>
//     </div>
//   );
// }
