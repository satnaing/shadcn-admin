import {
  Box,
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { tw } from "twind";
import Completed from "./sections/Completed";
import Pending from "./sections/Pending";

function History() {
  const [tabIndex, setTabIndex] = useState(0);
  const [isPendingPostApproving, setIsPendingPostApproving] = useState(false);
  const pendingPostRef = useRef<{
    approve: () => void;
    isApprovingPosts: boolean;
  }>();

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  const handleApprovePendingPosts = () => {
    if (pendingPostRef.current) {
      pendingPostRef.current.approve();
    }
  };

  return (
    <Box pt={{ base: "100px", md: "80px", xl: "80px" }} mt={5}>
      <Tabs colorScheme="brand" index={tabIndex} onChange={handleTabsChange}>
        <div className={tw(`flex justify-between`)}>
          <TabList className={tw(`w-full`)}>
            <Tab className={tw(`font-bold`)}>Completed</Tab>
            <Tab className={tw(`font-bold`)}>Pending</Tab>
          </TabList>
          <div>
            {Boolean(tabIndex === 1) && (
              <Button
                colorScheme="brand"
                fontSize="sm"
                onClick={handleApprovePendingPosts}
                isLoading={isPendingPostApproving}
              >
                Approve
              </Button>
            )}
          </div>
        </div>

        <TabPanels>
          <TabPanel>
            <Completed />
          </TabPanel>
          <TabPanel>
            <Pending
              ref={pendingPostRef}
              setIsPendingPostApproving={setIsPendingPostApproving}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default History;
