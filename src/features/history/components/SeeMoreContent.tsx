import { Button, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

function SeeMoreContent({
  handleOnExpand,
  isExpanded,
  children,
}: {
  handleOnExpand: () => void;
  isExpanded: boolean;
  children: ReactNode;
}) {
  return (
    <Flex direction="column" align="start">
      {children}
      <Button
        size="xs"
        mt={1}
        variant="link"
        colorScheme="blue"
        onClick={handleOnExpand}
      >
        {isExpanded ? "See Less" : "See More"}
      </Button>
    </Flex>
  );
}

export default SeeMoreContent;
