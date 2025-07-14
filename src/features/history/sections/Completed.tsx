import {
  Box,
  Button,
  Flex,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Card from "components/card/Card";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import { tw } from "twind";
import { truncateText } from "utils/string.util";
import SeeMoreContent from "../components/SeeMoreContent";
import { IPost } from "../interface/post.interface";
import { useGetCompletedPostsQuery } from "../query/post.query";

const columnHelper = createColumnHelper<IPost>();

function Completed() {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const { ref, inView } = useInView();
  const {
    data: dataWithPagination,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetCompletedPostsQuery();

  const [expandedPosts, setExpandedPosts] = useState<Record<number, boolean>>(
    {}
  );

  const toggleExpandPost = (rowIndex: number) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [rowIndex]: !prev[rowIndex],
    }));
  };

  const posts = useMemo(() => {
    const data: IPost[] = [];
    dataWithPagination?.pages?.forEach((p) => {
      p?.docs?.forEach((post) => data.push(post));
    });
    return data;
  }, [dataWithPagination?.pageParams]);

  const columns = [
    columnHelper.accessor("profile", {
      id: "profileName",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          ACCOUNT
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text
            color={textColor}
            fontSize="sm"
            fontWeight="700"
            textTransform="capitalize"
          >
            {`${info.getValue().firstName} ${info.getValue()?.lastName}`}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor(
      ({ activityUrn, content }) => ({ content, activityUrn }),
      {
        id: "post",
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: "10px", lg: "12px" }}
            color="gray.400"
          >
            POST
          </Text>
        ),
        cell: (info) => {
          const rowIndex = info.row.index;
          const { activityUrn, content } = info.getValue();
          return (
            <SeeMoreContent
              handleOnExpand={() => toggleExpandPost(rowIndex)}
              isExpanded={expandedPosts[rowIndex]}
            >
              <Text
                color="gray.700"
                fontSize="sm"
                fontWeight="700"
                textTransform="capitalize"
                whiteSpace="pre-wrap"
                noOfLines={expandedPosts[rowIndex] ? undefined : 2}
              >
                <a
                  href={`https://linkedin.com/feed/update/${activityUrn}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={tw(`cursor-pointer`)}
                >
                  {content}
                </a>
              </Text>
            </SeeMoreContent>
          );
        },
      }
    ),
    columnHelper.accessor("comment.content", {
      id: "comment",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          COMMENT
        </Text>
      ),
      cell: (info) => {
        return (
          <Flex alignItems="center" gap={2}>
            <Text
              color={textColor}
              fontSize="sm"
              fontWeight="700"
              textTransform="capitalize"
              whiteSpace="pre-wrap"
            >
              {info.getValue()}
            </Text>
          </Flex>
        );
      },
    }),
    columnHelper.accessor("comment.postedAt", {
      id: "postedAt",
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          COMMENTED ON
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text
            color={textColor}
            fontSize="sm"
            fontWeight="700"
            textTransform="capitalize"
          >
            {`${dayjs(info.getValue()).format("MMM DD YYYY")}`}
          </Text>
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data: posts,
    columns,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <>
      {posts?.length ? (
        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th
                      key={header.id}
                      colSpan={header.colSpan}
                      pe="10px"
                      borderColor={borderColor}
                      cursor="pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <Flex
                        justifyContent="space-between"
                        align="center"
                        fontSize={{ sm: "10px", lg: "12px" }}
                        color="gray.400"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: "",
                          desc: "",
                        }[header.column.getIsSorted() as string] ?? null}
                      </Flex>
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Td
                        key={cell.id}
                        fontSize={{ sm: "14px" }}
                        minW={{ sm: "150px", md: "200px", lg: "auto" }}
                        borderColor="transparent"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      ) : (
        <Flex gap={10} justifyContent="center" wrap="wrap">
          <Box maxW={{ lg: "600px" }} m="auto">
            <Card
              gap={5}
              p={10}
              px={{ lg: 20 }}
              fontWeight={500}
              mt={5}
              display="flex"
              justifyContent="center"
            >
              <div className={tw(`text-center`)}>
                <Icon as={FaLinkedin} w="32px" h="32px" />
              </div>
              <Text textAlign="center" fontSize="lg" fontWeight="bold">
                Oops! No Comments Yet
              </Text>
              <Text textAlign="center" fontSize="md">
                If your profile is connected, comments will appear within the
                next 2 hours or at the scheduled time.
              </Text>
            </Card>
          </Box>
        </Flex>
      )}

      {Boolean(posts?.length) && (
        <Flex justifyContent="center">
          <Button
            ref={ref}
            variant="brand"
            fontWeight="500"
            fontSize="sm"
            minW="120px"
            disabled={!hasNextPage || isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
              ? "Load More"
              : "Nothing more to load"}
          </Button>
        </Flex>
      )}
    </>
  );
}

export default Completed;
