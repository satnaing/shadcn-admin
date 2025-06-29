import { ArrowLeftIcon } from "@chakra-ui/icons";
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useGetUserQuery } from "views/auth/query/user.query";
import { planSetting } from "../../config/plan-setting.config";
import { CommentLengthEnum } from "../../enum/setting.enum";
import {
  ICommentSettingForm,
  ISetting,
} from "../../interface/setting.interface";
import {
  useCreateSettingQuery,
  useUpdateSettingQuery,
} from "../../query/setting.query";
import { useSettingFormStore } from "../../store/useSettingForm.store";
import dayjs from "dayjs";
import { convertToUTCHrMin } from "utils/date.util";

function CommentSetting({
  prev,
  setting,
  profileId,
}: {
  prev: () => void;
  setting: ISetting["commentSetting"];
  profileId: string;
}) {
  const { data: user } = useGetUserQuery();
  const userPlan = user?.subscribedProduct?.name?.toLowerCase() as
    | "starter"
    | "pro"
    | "premium";
  const { commentSetting, setCommentSetting, scrapeSetting, setScrapeSetting } =
    useSettingFormStore();
  const defaultValues = {
    length: CommentLengthEnum.MEDIUM,
  };
  const formRegistry = useForm<ICommentSettingForm>({
    defaultValues: commentSetting ?? setting ?? defaultValues,
  });
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = formRegistry;
  const history = useHistory();

  const { createSetting, isCreatingSetting } = useCreateSettingQuery({
    history,
  });
  const { updateSetting, isUpdatingSetting } = useUpdateSettingQuery({
    history,
  });

  const shouldDisplayTagAuthorSetting =
    planSetting["tagAuthor"]?.[userPlan] ?? false;

  const shouldDisplayCommentRulesSetting =
    planSetting["commentRules"]?.[userPlan] ?? false;

  const onSubmit = async (data: ICommentSettingForm) => {
    const {
      turnOnEmoji,
      turnOnExclamations,
      turnOnHashtags,
      about,
      tagAuthor,
    } = data;
    setCommentSetting({
      turnOnEmoji,
      turnOnExclamations,
      turnOnHashtags,
      about,
      tagAuthor,
    });
    const { hours, minutes } = convertToUTCHrMin(
      scrapeSetting?.hours ?? 1,
      scrapeSetting?.minutes ?? 0,
      scrapeSetting?.period ?? "AM"
    );
    const scrapeSettingPayload: any = {
      ...scrapeSetting,
      numberOfPostsToScrapePerDay: Number(
        scrapeSetting?.numberOfPostsToScrapePerDay
      ),
      jobTiming: {
        hours,
        minutes,
      },
      keyword: undefined,
      period: undefined,
    };

    const commentSettingPayload: any = {
      ...data,
      about: undefined,
    };
    const userPlan = user?.subscribedProduct?.name.toLowerCase() as
      | "starter"
      | "pro"
      | "premium";

    if (setting && Object.keys(setting).length) {
      updateSetting({
        commentSetting: commentSettingPayload,
        scrapeSetting: scrapeSettingPayload,
        profileId,
        about: data?.about,
        userPlan,
      });
    } else {
      createSetting({
        commentSetting: commentSettingPayload,
        scrapeSetting: scrapeSettingPayload,
        profileId,
        about: data?.about,
        userPlan,
      });
    }
  };

  useEffect(() => {
    return () => {
      setScrapeSetting(undefined);
      setCommentSetting(undefined);
    };
  }, []);

  return (
    <Card mt={8} p={5} pb={8} gap={5}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mt={5} isInvalid={Boolean(errors?.about?.message)}>
          <FormLabel>About You</FormLabel>
          <Textarea
            placeholder="I'm a digital marketer... I help people... I've helped 50+ founders to... After many failures, I learned that..."
            fontSize="sm"
            fontWeight="500"
            rows={4}
            {...register("about")}
          />
          <FormErrorMessage>{errors?.about?.message}</FormErrorMessage>
        </FormControl>

        {shouldDisplayCommentRulesSetting && (
          <FormControl mt={5} isInvalid={Boolean(errors?.rules?.message)}>
            <FormLabel>Additional Comment Generation Rules</FormLabel>
            <Textarea
              placeholder="Write additional rules, e.g., Avoid phrases like 'Great post' or 'Nice work."
              fontSize="sm"
              fontWeight="500"
              rows={2}
              {...register("rules")}
            />
            <FormErrorMessage>{errors?.rules?.message}</FormErrorMessage>
          </FormControl>
        )}

        <FormControl mt={5} isInvalid={Boolean(errors?.length?.message)}>
          <FormLabel mt={5}>Comment Length</FormLabel>
          <Select
            defaultValue={CommentLengthEnum.MEDIUM}
            {...register("length")}
          >
            <option value={CommentLengthEnum.SHORT}>Short</option>
            <option value={CommentLengthEnum.MEDIUM}>Medium</option>
            <option value={CommentLengthEnum.LONG}>Long</option>
          </Select>
          <FormErrorMessage>{errors?.length?.message}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel mt={5}>Writer settings</FormLabel>
          <Stack
            rowGap={2}
            columnGap={5}
            direction={["column", "row"]}
            flexWrap="wrap"
          >
            <Checkbox colorScheme="blue" {...register("turnOnEmoji")}>
              Turn on emoji
            </Checkbox>
            <Checkbox colorScheme="blue" {...register("turnOnExclamations")}>
              Turn on exclamations
            </Checkbox>
            <Checkbox colorScheme="blue" {...register("turnOnHashtags")}>
              Turn on hashtags
            </Checkbox>
            {shouldDisplayTagAuthorSetting && (
              <Checkbox colorScheme="blue" {...register("tagAuthor")}>
                Tag Post Author
              </Checkbox>
            )}
          </Stack>

          <Flex mt={8} justify="space-between">
            <Button
              variant="brand"
              fontWeight="500"
              fontSize="sm"
              type="submit"
              minW="120px"
              leftIcon={<ArrowLeftIcon />}
              onClick={prev}
            >
              Back
            </Button>
            <Button
              variant="brand"
              fontWeight="500"
              fontSize="sm"
              type="submit"
              minW="120px"
              isLoading={isCreatingSetting || isUpdatingSetting}
              loadingText="Submitting"
            >
              Submit
            </Button>
          </Flex>
        </FormControl>
      </form>
    </Card>
  );
}
export default CommentSetting;
