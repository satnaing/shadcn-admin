import {
  Box,
  Flex,
  IconButton,
  Tag,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import { useMemo, useState } from "react";
import { LuLink, LuSettings2 } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useHistory } from "react-router-dom";
import { tw } from "twind";
import { ProfileStatusEnum } from "../enum/profile.enum";
import { IProfile } from "../interface/profile.interface";
import { useDeleteProfile, useLinkProfile } from "../query/profile.query";
import {
  getProfileDetailsFromExtension,
  handleResponseFromExtension,
} from "../utils";

function ProfileCard({
  firstName,
  lastName,
  status,
  publicIdentifier,
  setting,
  _id,
}: IProfile) {
  const cardHoverShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  const cardShadow = useColorModeValue(
    "0px 6px 15px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const bg = useColorModeValue("white", "navy.700");
  const iconBgColor = useColorModeValue("brand.500", "blue");
  const iconBgHoverColor = useColorModeValue("brand.300", "blue");

  const history = useHistory();
  const { deleteProfile, isDeletingProfile } = useDeleteProfile();
  const [isLinking, setIsLinking] = useState(false);
  const { isLinkingProfile, linkProfile } = useLinkProfile();

  const isSettingNotCreated =
    !setting || (setting && !Object.keys(setting).length);

  const getProfileStatus = () => {
    if (isSettingNotCreated) return "Not Activated";
    else if (status === ProfileStatusEnum.ACTION_REQUIRED)
      return "Disconnected";
    else if (status === ProfileStatusEnum.OK) return "Connected";
    else if (status === ProfileStatusEnum.DEACTIVATED) return "Deactivated";
    return "No Status";
  };

  const shouldShowLinkButton = useMemo(() => {
    const profileStatus = getProfileStatus();
    if (profileStatus === "Disconnected") return true;
    return false;
  }, [status, setting]);

  const getProfileStatusTextColor = () => {
    if (!setting) return "red.400";
    else if (status === ProfileStatusEnum.ACTION_REQUIRED) return "red.400";
    else if (status === ProfileStatusEnum.OK) return "green.400";
    return "red.400";
  };

  const handleOnDeleteBtn = () => {
    deleteProfile(_id);
  };

  const goToSettingPage = () => {
    history.push(`/profile/${_id}/setting`);
  };

  const handleCtaOnClick = async () => {
    if (shouldShowLinkButton) {
      setIsLinking(true);
      const profileDetails = await getProfileDetailsFromExtension();
      linkProfile(profileDetails);
      setIsLinking(false);
    } else goToSettingPage();
  };

  return (
    <Card
      bg={bg}
      p={6}
      minW="250px"
      maxW="350px"
      boxShadow={cardShadow}
      className={tw(`transition-all ease-in-out hover:cursor-pointer`)}
      _hover={{ boxShadow: cardHoverShadow }}
    >
      <Box w="full">
        <Box mt={{ base: "10px", md: "0" }}>
          <Text color={textColorPrimary} fontWeight="500" fontSize="md">
            {`${firstName} ${lastName}`}
          </Text>
          <Text
            fontWeight="500"
            color={textColorSecondary}
            fontSize="sm"
            me="4px"
            mb="4px"
          >
            {`@${publicIdentifier}`}
          </Text>
          <Flex gap={3} alignItems="center">
            <Text
              fontWeight="500"
              color={getProfileStatusTextColor()}
              fontSize="sm"
              me="4px"
            >
              {getProfileStatus()}
            </Text>
            {isSettingNotCreated && (
              <Tag
                variant="solid"
                colorScheme="facebook"
                size="md"
                onClick={goToSettingPage}
              >
                Next Step {">>"}
              </Tag>
            )}
          </Flex>

          <Flex
            justifyContent="flex-end"
            alignItems="center"
            w="full"
            gap={2}
            mt={5}
          >
            <Tooltip label="Disconnect your LinkedIn account">
              <IconButton
                aria-label="Settings"
                icon={<RiDeleteBin6Line />}
                size="md"
                bgColor={iconBgColor}
                color="white"
                _hover={{ backgroundColor: iconBgHoverColor }}
                onClick={handleOnDeleteBtn}
                isLoading={isDeletingProfile}
              />
            </Tooltip>

            <Tooltip
              label={
                shouldShowLinkButton
                  ? "Connect your LinkedIn profile"
                  : "Go to keyword settings"
              }
            >
              <IconButton
                aria-label="Settings"
                icon={shouldShowLinkButton ? <LuLink /> : <LuSettings2 />}
                size="md"
                bgColor={iconBgColor}
                color="white"
                _hover={{ backgroundColor: iconBgHoverColor }}
                onClick={handleCtaOnClick}
                isLoading={isLinking || isLinkingProfile}
              />
            </Tooltip>
          </Flex>
        </Box>
      </Box>
    </Card>
  );
}

export default ProfileCard;
