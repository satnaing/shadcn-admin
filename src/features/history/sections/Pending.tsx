import {
  Box,
  Checkbox,
  Flex,
  Icon,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import "assets/css/Pagination.css";
import Card from "components/card/Card";
import dayjs from "dayjs";
import {
  Dispatch,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { FaLinkedin } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";
import ReactPaginate from "react-paginate";
import { QueryService } from "services/query.service";
import { tw } from "twind";
import SeeMoreContent from "../components/SeeMoreContent";
import { IPost } from "../interface/post.interface";
import {
  PostQueryEnum,
  useApprovePosts,
  useGetPendingPostsQuery,
  useUpdatePostComment,
} from "../query/post.query";

const columnHelper = createColumnHelper<IPost>();

interface IProps {
  setIsPendingPostApproving: Dispatch<React.SetStateAction<boolean>>;
}

const Pending = forwardRef(({ setIsPendingPostApproving }: IProps, ref) => {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const iconBgColor = useColorModeValue("brand.500", "blue");
  const iconBgHoverColor = useColorModeValue("brand.300", "blue");

  const [expandedPosts, setExpandedPosts] = useState<Record<number, boolean>>(
    {}
  );
  const [editCommentActiveKeys, setEditCommentActiveKeys] = useState<
    Record<string, string>
  >({});
  const inputRefs = useRef<Record<string, HTMLTextAreaElement>>({});
  const [page, setPage] = useState(1);

  const { data: dataWithPagination, isFetching } =
    useGetPendingPostsQuery(page);

  const handleExitCommentEdit = (activityUrn: string) => {
    setEditCommentActiveKeys((prev) => ({
      ...prev,
      [activityUrn]: undefined,
    }));
  };

  const handleSaveCommentSuccess = (activityUrn: string) => {
    const queryClient = QueryService.getQueryClient();
    queryClient.invalidateQueries([PostQueryEnum.GET_PENDING_POSTS, page]);
    handleExitCommentEdit(activityUrn);
  };

  const { updateComment, isUpdatingComment } = useUpdatePostComment(
    handleSaveCommentSuccess
  );

  const toggleExpandPost = (rowIndex: number) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [rowIndex]: !prev[rowIndex],
    }));
  };

  const handleSetEditComment = (
    activityUrn: string,
    currentContent: string
  ) => {
    setEditCommentActiveKeys((prev) => ({
      ...prev,
      [activityUrn]: currentContent,
    }));
  };

  const handleSaveComment = ({
    profileId,
    activityUrn,
  }: {
    profileId: string;
    activityUrn: string;
  }) => {
    const commentContent = inputRefs.current?.[activityUrn]?.value;
    if (commentContent) {
      updateComment({
        activityUrn,
        profileId,
        commentContent,
      });
    }
  };

  const posts = useMemo(() => {
    return dataWithPagination?.docs;
  }, [dataWithPagination?.docs]);

  const currentPostCount = useMemo(() => posts?.length, [posts?.length]);

  const totalPages = useMemo(
    () => dataWithPagination?.totalPages,
    [dataWithPagination?.totalPages]
  );

  const columns: ColumnDef<IPost, any>[] = [
    {
      id: "select-post",
      header: ({ table }) => (
        <Checkbox
          colorScheme="brand"
          isChecked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          colorScheme="brand"
          isChecked={row.getIsSelected()}
          isDisabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    },
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
    columnHelper.accessor(
      (row) => ({
        activityUrn: row.activityUrn,
        content: row.comment.content,
        profileId: row.profileId,
      }),
      {
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
          const rowIndex = info.row.index;
          const { activityUrn, content, profileId } = info.getValue();
          const editContent = editCommentActiveKeys[activityUrn];
          const inputKey = `${activityUrn}`;
          return (
            <Flex
              alignItems="center"
              gap={2}
              justifyContent="space-between"
              className={tw(`min-w-[300px]! text-sm!`)}
            >
              {editContent ? (
                <Textarea
                  ref={(el) => {
                    inputRefs.current[inputKey] = el;
                  }}
                  defaultValue={content}
                  rows={3}
                  resize="vertical"
                  color="black"
                  fontSize={"sm"}
                />
              ) : (
                <Text
                  color={textColor}
                  fontSize="sm"
                  fontWeight="700"
                  textTransform="capitalize"
                  whiteSpace="pre-wrap"
                >
                  {info.getValue().content}
                </Text>
              )}

              {editContent ? (
                <Flex gap={2} direction="column">
                  <IconButton
                    aria-label="edit"
                    icon={<TiTick />}
                    bgColor={iconBgColor}
                    color="white"
                    _hover={{ backgroundColor: iconBgHoverColor }}
                    size="sm"
                    onClick={() =>
                      handleSaveComment({ profileId, activityUrn })
                    }
                    isLoading={isUpdatingComment}
                  />
                  <IconButton
                    aria-label="edit"
                    icon={<RxCross2 />}
                    bgColor={iconBgColor}
                    color="white"
                    _hover={{ backgroundColor: iconBgHoverColor }}
                    size="sm"
                    isLoading={isUpdatingComment}
                    onClick={() => handleExitCommentEdit(activityUrn)}
                  />
                </Flex>
              ) : (
                <IconButton
                  aria-label="edit"
                  icon={<FiEdit3 />}
                  bgColor={iconBgColor}
                  color="white"
                  _hover={{ backgroundColor: iconBgHoverColor }}
                  size="sm"
                  onClick={() => handleSetEditComment(activityUrn, content)}
                />
              )}
            </Flex>
          );
        },
      }
    ),
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
  });

  const handleApprovePostSuccess = () => {
    table.resetRowSelection();
  };

  const { approvePosts, isApprovingPosts } = useApprovePosts(
    page,
    handleApprovePostSuccess
  );

  const handleApprovePosts = () => {
    const selectedPostRows = table.getSelectedRowModel();
    const selectedPosts = selectedPostRows.flatRows.map(
      (post) => post.original
    );
    const approvePostsPayload = selectedPosts.map(
      ({ activityUrn, profileId }) => ({ activityUrn, profileId })
    );
    if (approvePostsPayload?.length) {
      approvePosts({ posts: approvePostsPayload });
    }
  };

  useImperativeHandle(ref, () => ({
    approve() {
      handleApprovePosts();
    },
  }));

  useEffect(() => {
    setIsPendingPostApproving(isApprovingPosts);
  }, [isApprovingPosts]);

  return (
    <>
      {Boolean(currentPostCount) && (
        <>
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
          <ReactPaginate
            containerClassName="pagination"
            pageClassName="page-item"
            activeClassName="active"
            onPageChange={(event) => setPage(event.selected + 1)}
            pageCount={totalPages}
            breakLabel="..."
          />
        </>
      )}

      {!posts?.length && !isFetching && (
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
                If you've disabled auto schedule, you can view all the posts
                waiting for your approval.
              </Text>
            </Card>
          </Box>
        </Flex>
      )}
    </>
  );
});

export default Pending;
