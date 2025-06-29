import { ArrowRightIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { omit } from "@chakra-ui/utils";
import Card from "components/card/Card";
import { FocusEvent, KeyboardEvent, useMemo } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  IScrapeSettingForm,
  ISetting,
} from "../../interface/setting.interface";
import { useSettingFormStore } from "../../store/useSettingForm.store";
import { TbExternalLink, TbInfoCircle } from "react-icons/tb";
import { tw } from "twind";
import { buildSearchUrl } from "../../utils/linkedin.util";
import { planSetting } from "../../config/plan-setting.config";
import { useGetUserQuery } from "views/auth/query/user.query";
import { removeFirstAndLastSpace } from "utils/string.util";
import { EngagementThresholdEnum } from "../../enum/setting.enum";
import { convertFromUTCHrMin } from "utils/date.util";

function ScrapeSetting({
  next,
  setting,
}: {
  next: () => void;
  setting: ISetting["scrapeSetting"];
}) {
  const { data: user } = useGetUserQuery();
  const updatedSettingFromBackend = useMemo(() => {
    if (setting?.jobTiming) {
      const { hours: utcHour, minutes: utcMinute } = setting?.jobTiming;
      const updatedJobTiming = convertFromUTCHrMin(utcHour, utcMinute);
      return {
        ...setting,
        ...updatedJobTiming,
      };
    }
    return setting;
  }, [setting]);
  const userPlan = user?.subscribedProduct?.name?.toLowerCase() as
    | "starter"
    | "pro"
    | "premium";
  const { scrapeSetting, setScrapeSetting } = useSettingFormStore();
  const defaultValues = {
    skipHiringPosts: true,
    skipJobUpdatePosts: true,
    skipArticlePosts: true,
    autoSchedule: true,
  };
  const formRegistry = useForm<IScrapeSettingForm>({
    defaultValues: scrapeSetting ?? updatedSettingFromBackend ?? defaultValues,
  });
  const iconBgColor = useColorModeValue("brand.500", "blue");

  const maxNumberOfCommentsPerData =
    planSetting["numberOfPostsToScrapePerDay"]?.[userPlan] ?? 20;

  const shouldDisplayEngagementThreshold =
    planSetting["engagementThreshold"]?.[userPlan] ?? false;

  const shouldDisplayScrapeRules =
    planSetting["scrapeRules"]?.[userPlan] ?? false;

  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
    setValue,
    watch,
  } = formRegistry;

  const { append, remove } = useFieldArray({
    control,
    name: "keywordsToTarget" as never,
    rules: {
      required: "Please enter atleast 1 keyword",
    },
  });
  const keywords = watch("keywordsToTarget") ?? [];
  const tempKeyword = watch("keyword");

  const onSubmit = (data: IScrapeSettingForm) => {
    const formData = omit(data, ["keyword"]);
    setScrapeSetting(formData);
    next();
  };

  const keywordRegex = /^[a-zA-Z0-9\s.,'-]+$/;

  const addKeyword = (value: string) => {
    if (keywordRegex.test(value) && keywords.length < 6) {
      append(value);
      setValue("keyword", "");
    }
  };

  const appendKeyword = (value: string) => {
    const keywords = value
      .split(",")
      .map((keyword) => removeFirstAndLastSpace(keyword))
      .filter(Boolean);

    keywords.forEach((keyword) => addKeyword(keyword));
  };

  const onKeywordsFieldBlur = (
    event: FocusEvent<HTMLInputElement, Element>
  ) => {
    const value = event.target.value;
    appendKeyword(value);
  };

  const onKeywordsFieldKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    if (event.key === "Enter") appendKeyword(value);
  };

  const onRemoveKeyword = (index: number) => {
    remove(index);
  };

  const handleOnSubmitKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const liSearchUrl = buildSearchUrl(keywords);

  return (
    <Card mt={8} p={5} pb={8} gap={5}>
      <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleOnSubmitKeyDown}>
        <FormControl
          mt={4}
          isRequired
          isInvalid={Boolean(errors?.keywordsToTarget)}
        >
          <FormLabel>Target Keywords</FormLabel>
          <Flex gap={1} mb={keywords?.length ? 3 : 0}>
            {keywords?.map((field, index) => (
              <Tag
                size={"md"}
                borderRadius="full"
                variant="solid"
                colorScheme="blue"
                key={index}
              >
                <TagLabel>{field}</TagLabel>
                <TagCloseButton onClick={() => onRemoveKeyword(index)} />
              </Tag>
            ))}
          </Flex>

          <Controller
            control={formRegistry.control}
            name="keyword"
            render={({ field: { onChange, value } }) => (
              <InputGroup size="md">
                <Input
                  placeholder="e.g. marketing"
                  fontSize="sm"
                  fontWeight="500"
                  onChange={onChange}
                  value={value}
                  onBlur={onKeywordsFieldBlur}
                  onKeyDown={onKeywordsFieldKeyDown}
                  required={false}
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Insert"
                    icon={<ChevronRightIcon />}
                    size="sm"
                    bgColor={iconBgColor}
                    color="white"
                    onClick={() => appendKeyword(tempKeyword)}
                  />
                </InputRightElement>
              </InputGroup>
            )}
          />
          <FormHelperText>Max 6 keywords are allowed</FormHelperText>
          {Boolean(keywords?.length) && (
            <FormHelperText className={tw(`flex items-center gap-1`)}>
              <TbInfoCircle />
              <a href={liSearchUrl} target="_blank">
                Click here to check LinkedIn posts for these keywords before
                saving, or comments won’t be posted.
              </a>
              <TbExternalLink />
            </FormHelperText>
          )}

          {Boolean(errors?.keywordsToTarget) && (
            <FormErrorMessage>Please enter at least 1 keyword</FormErrorMessage>
          )}
        </FormControl>

        <FormControl
          mt={5}
          isRequired
          isInvalid={Boolean(errors?.numberOfPostsToScrapePerDay?.message)}
        >
          <FormLabel>Number of posts to comment per day</FormLabel>
          <Input
            placeholder="50"
            fontSize="sm"
            fontWeight="500"
            type="number"
            max={maxNumberOfCommentsPerData as number}
            {...register("numberOfPostsToScrapePerDay")}
          />
          <FormHelperText textAlign="start" fontSize="xs" ml={1}>
            Max. {maxNumberOfCommentsPerData} posts per day
          </FormHelperText>
          <FormErrorMessage>
            {errors?.numberOfPostsToScrapePerDay?.message}
          </FormErrorMessage>
        </FormControl>

        <Flex columnGap={10} wrap="wrap">
          <Box flex={1} minW="300px">
            {shouldDisplayEngagementThreshold && (
              <FormControl
                mt={5}
                isRequired
                isInvalid={Boolean(errors?.engagementThreshold?.message)}
              >
                <FormLabel>Comment Monitoring Based on Engagement</FormLabel>
                <Select
                  defaultValue={EngagementThresholdEnum.DISABLED}
                  {...register("engagementThreshold")}
                >
                  <option value={EngagementThresholdEnum.STRICT}>
                    Strict Engagement Check
                  </option>
                  <option value={EngagementThresholdEnum.MODERATE}>
                    Moderate Engagement Check
                  </option>
                  <option value={EngagementThresholdEnum.DISABLED}>
                    Comment Immediately
                  </option>
                </Select>
                <FormHelperText textAlign="start" fontSize="xs" ml={1}>
                  Choose when to post comments based on the engagement level
                </FormHelperText>
                <FormErrorMessage>
                  {errors?.engagementThreshold?.message}
                </FormErrorMessage>
              </FormControl>
            )}
          </Box>
          <Box mt={5}>
            <FormLabel>Select Time to Start Commenting</FormLabel>
            <Flex gap={3}>
              <FormControl
                isRequired
                isInvalid={Boolean(errors?.hours?.message)}
              >
                <Select defaultValue={"01"} {...register("hours")}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {(i + 1).toString().padStart(2, "0")}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors?.hours?.message}</FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={Boolean(errors?.minutes?.message)}
              >
                <Select defaultValue={"00"} {...register("minutes")}>
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, "0")}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors?.minutes?.message}</FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={Boolean(errors?.period?.message)}
              >
                <Select defaultValue={"AM"} {...register("period")}>
                  <option value={"AM"}>AM</option>
                  <option value={"PM"}>PM</option>
                </Select>
                <FormErrorMessage>{errors?.period?.message}</FormErrorMessage>
              </FormControl>
            </Flex>

            <FormHelperText textAlign="start" fontSize="xs" ml={1}>
              Choose when to post comments based on the engagement level
            </FormHelperText>
          </Box>
        </Flex>

        {shouldDisplayScrapeRules && (
          <FormControl mt={5} isInvalid={Boolean(errors?.rules?.message)}>
            <FormLabel>Additional Post Evaluation Rules</FormLabel>
            <Textarea
              placeholder="Set a rule, e.g., Skip posts with hashtags like #ad or #sponsored."
              fontSize="sm"
              fontWeight="500"
              rows={2}
              {...register("rules")}
            />
            <FormHelperText textAlign="start" fontSize="xs" ml={1}>
              Specify rules to decide if a post is worth commenting on.
            </FormHelperText>
            <FormErrorMessage>{errors?.rules?.message}</FormErrorMessage>
          </FormControl>
        )}

        <FormControl mt={5}>
          <Checkbox colorScheme="blue" {...register("autoSchedule")}>
            Post comments automatically
          </Checkbox>
        </FormControl>

        <FormControl>
          <FormLabel mt={5}>Skip commenting on</FormLabel>
          <Stack
            rowGap={2}
            columnGap={5}
            direction={["column", "row"]}
            flexWrap="wrap"
          >
            <Checkbox colorScheme="blue" {...register("skipHiringPosts")}>
              Hiring Posts
            </Checkbox>
            <Checkbox colorScheme="blue" {...register("skipJobUpdatePosts")}>
              Job Update Posts
            </Checkbox>
            <Checkbox colorScheme="blue" {...register("skipCompanyPosts")}>
              Company Posts
            </Checkbox>
            <Checkbox colorScheme="blue" {...register("skipArticlePosts")}>
              Article Posts
            </Checkbox>
          </Stack>
        </FormControl>

        <Flex mt={8} justify="flex-end">
          <Button
            variant="brand"
            fontWeight="500"
            fontSize="sm"
            type="submit"
            minW="120px"
            rightIcon={<ArrowRightIcon />}
          >
            Next
          </Button>
        </Flex>
      </form>
    </Card>
  );
}

export default ScrapeSetting;
