import { useState, useEffect } from "react";
import {
  InstructionText,
  InfiniteScrollTable,
  Heading,
  Paragraph
} from "@contentstack/venus-components";
import ContentstackUIExtension from "@contentstack/ui-extensions-sdk";
import "../App.css";
import { orderBy } from "lodash";

export default function VTable(props) {
  let [data, updateData] = useState([]);
  let [itemStatusMap, updateItemStatusMap] = useState({});
  let [loading, updateLoading] = useState(false);
  let [viewBy, updateViewBy] = useState("Comfort");
  let [totalCounts, updateTotalCounts] = useState(null);
  let [selectedAssets, updateSelectedAssets] = useState({});
  let [resetRowSelection, updateResetRowSelection] = useState(false);

  const [error, setError] = useState(null);
  const [extension, setExtension] = useState(null);
  const [currentSelection, setCurrentSelection] = useState({"title": "None", "uid": ""});

  useEffect(() => {
    // eslint-disable-next-line no-restricted-globals
    if (self === top) {
      setError({
        message: "This extension can only be used in the Contentstack",
      });
    } else {
      ContentstackUIExtension.init().then((extension) => {
        setExtension(extension);
      });
    }
  }, []);

  // const makeData = (size) => {
  //   const data = [];
  //   for (let i = 1; i <= size; i++) {
  //     const dataObject = {
  //       title: `Can Augmented And Future Reality Build Empathy${i}`,
  //       uuid: `blt006d3106e3a6532b${i}`,
  //       age: i,
  //       status: i % 2 === 0 ? "active" : "inactive",
  //       uid: `test${i}`,
  //       _canSelect: i % 2 === 0 ? true : false,
  //     };
  //     data.push(dataObject);
  //   }
  //   console.log(data)
  //   return data;
  // };

  const makeData = () => {
    return props.filteredData;
  };

  const serverData = makeData();

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!extension) {
    return <p>Loading...</p>;
  }

  const filterData = ({ skip, limit, sortBy }) => {
    let responseData = serverData;
    //sort first and then paginate
    if (sortBy) {
      const { sortingDirection, id } = sortBy;
      responseData = orderBy(serverData, [id], [sortingDirection]);
    }

    const skippedData = responseData.slice(skip, responseData.length);
    const limitedData = skippedData.slice(0, limit);
    extension.window.updateHeight();
    return { data: limitedData, count: responseData.length };
  };

  const fakeServer = ({ skip, limit, sortBy }) => {
    console.log("fakeServer -> skip, limit", skip, limit, sortBy);
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = filterData({ skip, limit, sortBy });
        return resolve(data);
      }, 200);
    });
  };

  const fetchData = async ({
    sortBy,
    searchText,
    skip,
    limit,
    startIndex,
    stopIndex,
  }) => {
    try {
      let itemStatusMap = {};
      for (let index = 0; index <= props.filteredData.length; index++) {
        itemStatusMap[index] = "loading";
      }

      updateItemStatusMap(itemStatusMap);
      updateLoading(true);

      const response = await fakeServer({
        skip: 0,
        limit: props.filteredData.length,
        sortBy,
      });
      for (let index = 0; index <= 1; index++) {
        itemStatusMap[index] = "loaded";
      }

      updateItemStatusMap({ ...itemStatusMap });
      updateLoading(false);
      updateData(response.data);
      updateTotalCounts(response.count);
    } catch (error) {
      console.log("fetchData -> error", error);
    }
  };

  const loadMoreItems = async ({
    sortBy,
    searchText,
    skip,
    limit,
    startIndex,
    stopIndex,
  }) => {
    try {
      let itemStatusMapCopy = { ...itemStatusMap };

      for (let index = startIndex; index <= stopIndex; index++) {
        itemStatusMapCopy[index] = "loading";
      }

      updateItemStatusMap({ ...itemStatusMapCopy });
      updateLoading(true);

      const response = await fakeServer({ skip, limit, sortBy });

      let updateditemStatusMapCopy = { ...itemStatusMap };

      for (let index = startIndex; index <= stopIndex; index++) {
        updateditemStatusMapCopy[index] = "loaded";
      }

      updateItemStatusMap({ ...updateditemStatusMapCopy });
      updateLoading(false);
      updateData([...data, ...response.data]);
      updateTotalCounts(response.count);
    } catch (error) {
      console.log("loadMoreItems -> error", error);
    }
  };

  const getViewByValue = (selectedViewBy) => {
    updateViewBy(selectedViewBy);
  };

  const getSelectedRow = (singleSelectedRowIds, selectedData) => {
    let selectedObj = {};
    singleSelectedRowIds.forEach((assetUid) => {
      selectedObj[assetUid] = true;
    });
    updateSelectedAssets({ ...selectedObj });
  };

  const columns = [
    {
      Header: "Title",
      id: "title",
      accessor: (data) => {
        if (viewBy === "Comfort") {
          return (
            <div>
              <div className="content-title">{data.title}</div>
              <InstructionText> Content Type: Header content </InstructionText>
            </div>
          );
        }
        return <div className="content-title"> {data.title} </div>;
      },
      default: true,
      addToColumnSelector: true,
    },
    {
      Header: "Unique UID",
      accessor: "uid",
      default: false,
      addToColumnSelector: true,
      cssClass: "uidCustomClass",
    },
    {
      Header: "Author",
      id: "author",
      accessor: (data) => {
        if (viewBy === "Comfort") {
          return (
            <div>
              <div>{data.author}</div>
              {/* <DateLabel date={'1992-04-14'} /> */}
            </div>
          );
        }
        return data.author;
      },
      default: false,
      disableSortBy: true,
      addToColumnSelector: true,
      cssClass: "uidCustomClass",
    },
    {
      Header: "Biography",
      accessor: "biography",
      default: false,
      disableSortBy: true,
      addToColumnSelector: true,
    },
    {
      Header: "Occupation",
      accessor: "occupation",
      default: false,
      disableSortBy: true,
      addToColumnSelector: true,
    },
    {
      Header: "Tags",
      accessor: (data) => {
        return data.tags.join(", ");
      },
      default: false,
      disableSortBy: true,
      addToColumnSelector: true,
    },
  ];

  const onRowSelectProp = [
    {
      label: "Add as Reference",
      cb: (data) => {
        extension.field.setData([
          {
            "uid": data.data[0].uid,
            "_content_type_uid": "blog"
            }]);
        console.log(extension.field)
        setCurrentSelection(data.data[0]);
        console.log(currentSelection)
        updateResetRowSelection(true);

      },
    },
  ];

  return (
    <div>
      <Heading tagName="h5" text='Current Selected Entry: ' />
      <Paragraph tagName='p' className="current-selection" text={`${currentSelection.title + " (" + currentSelection.uid + ")"}`} />
      {/* <p>{Object.keys(selectedAssets)[0] ?? "test"}</p> */}
      <InfiniteScrollTable
        key={props.filteredData}
        data={data}
        columns={columns}
        uniqueKey={"uid"}
        fetchTableData={fetchData}
        loading={loading}
        totalCounts={totalCounts}
        loadMoreItems={loadMoreItems}
        itemStatusMap={itemStatusMap}
        minBatchSizeToFetch={props.filteredData.length}
        // viewSelector={args.viewSelector}
        getViewByValue={getViewByValue}
        initialSortBy={[{ id: "title", desc: true }]}
        // columnSelector={args.columnSelector}
        // searchPlaceholder={args.searchPlaceholder}
        canSearch={true}
        canRefresh={true}
        fullRowSelect={true}
        initialSelectedRowIds={selectedAssets}
        isRowSelect={true}
        onRowSelectProp={onRowSelectProp}
        getSelectedRow={getSelectedRow}
      />
    </div>
  );
}
