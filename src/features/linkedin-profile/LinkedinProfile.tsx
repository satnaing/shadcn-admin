import { Box, Button, Flex, Icon, Spinner, Text } from "@chakra-ui/react";
import Card from "components/card/Card";
import { envConfig } from "@/config/env.config";
import { useEffect, useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import { tw } from "twind";
import ProfileCard from "./components/ProfileCard";
import { useGetAllProfileQuery, useLinkProfile } from "./query/profile.query";
import {
  checkIsExtensionInstalled,
  getProfileDetailsFromExtension,
} from "./utils";

function LinkedinProfile() {
  const { data, isLoading } = useGetAllProfileQuery();
  const { isLinkingProfile, linkProfile } = useLinkProfile();
  const [isExtensionInstalled, setIsExtensionInstalled] = useState(false);
  const [isLinking, setIsLinking] = useState(false);

  const checkIfExtensionIsInstalled = async () => {
    const isInstalled = await checkIsExtensionInstalled(
      envConfig.chromeExtensionId,
      envConfig.chromeExtensionIconUrl
    );
    setIsExtensionInstalled(isInstalled);
  };

  const handleLinking = async () => {
    setIsLinking(true);
    const profileDetails = await getProfileDetailsFromExtension();
    linkProfile(profileDetails);
    setIsLinking(false);
  };

  useEffect(() => {
    checkIfExtensionIsInstalled();
  }, []);

  if (isLoading)
    return (
      <Box pt={{ base: "100px", md: "80px", xl: "80px" }} mt={5}>
        <Box maxW={{ lg: "850px" }} m="auto">
          <Card
            gap={5}
            p={5}
            fontWeight={500}
            mt={5}
            display="flex"
            justifyContent="center"
          >
            <Text textAlign="center" fontSize="lg" fontWeight="bold">
              Hold tight! Info's en route! 🚀
            </Text>
            <Flex justifyContent="center">
              <Spinner color="brand.500" size="md" />
            </Flex>
          </Card>
        </Box>
      </Box>
    );

  return (
    <Box pt={{ base: "100px", md: "80px", xl: "80px" }} mt={5}>
      {data.length ? (
        <Flex gap={10} justifyContent="flex-start" wrap="wrap">
          {data.map((profileData) => (
            <ProfileCard key={profileData._id} {...profileData} />
          ))}
        </Flex>
      ) : (
        <Flex gap={10} justifyContent="center" wrap="wrap">
          <Box maxW={{ lg: "850px" }} m="auto">
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
                Oops! No accounts connected.
              </Text>
              {isExtensionInstalled ? (
                <Button
                  variant="brand"
                  onClick={handleLinking}
                  isLoading={isLinking || isLinkingProfile}
                >
                  Connect your LinkedIn
                </Button>
              ) : (
                <Text textAlign="center" fontSize="md">
                  Download our{" "}
                  <a
                    href={envConfig.extensionUrl}
                    className={tw(`text-[#422AFB]`)}
                    target="_blank"
                  >
                    Chrome extension{" "}
                  </a>
                  to activate your profile!
                </Text>
              )}
            </Card>
          </Box>
        </Flex>
      )}
    </Box>
  );
}

export default LinkedinProfile;
