// import { Box, Spinner } from "@chakra-ui/react";
// import { Step, Steps, useSteps } from "chakra-ui-steps";
// import { useMemo } from "react";
// import { useParams } from "react-router-dom";
// import { tw } from "twind";
// import { useGetAllProfileQuery } from "../linkedin-profile/query/profile.query";
// import CommentSetting from "./components/steps/CommentSetting";
// import ScrapeSetting from "./components/steps/ScrapeSetting";

// function Setting() {
//   const { data, isLoading } = useGetAllProfileQuery();
//   const { id = "" } = useParams() as { id?: string };
//   const profileSettingData = useMemo(() => {
//     const profile = data?.find((dt) => dt._id === id);
//     const settingData = {
//       ...profile?.setting,
//       commentSetting: {
//         ...profile?.setting?.commentSetting,
//         about: profile?.about,
//       },
//     };
//     const cleanSettingData = JSON.parse(JSON.stringify(settingData));
//     return cleanSettingData;
//   }, [data]);

//   const { nextStep, activeStep, prevStep } = useSteps({
//     initialStep: 0,
//   });

//   if (isLoading)
//     return (
//       <Box pt={{ base: "100px", md: "80px", xl: "80px" }} mt={5}>
//         <div className={tw(`flex flex-col items-center gap-5`)}>
//           <Spinner color="brand.500" size="lg" />
//           <p className={tw(`text-xl font-medium`)}>Loading</p>
//         </div>
//       </Box>
//     );

//   return (
//     <Box pt={{ base: "100px", md: "80px", xl: "80px" }} mt={5}>
//       <Box maxW={{ lg: "950px" }} m="auto">
//         <Steps
//           activeStep={activeStep}
//           colorScheme="messenger"
//           fontFamily="DM Sans"
//         >
//           <Step
//             label="Keyword settings"
//             description="Comment on posts with targeted keywords"
//           >
//             <ScrapeSetting
//               next={nextStep}
//               setting={profileSettingData?.scrapeSetting}
//             />
//           </Step>
//           <Step
//             label="Comment settings"
//             description="Customize and personalize your comments"
//           >
//             <CommentSetting
//               prev={prevStep}
//               setting={profileSettingData?.commentSetting}
//               profileId={id}
//             />
//           </Step>
//         </Steps>
//       </Box>
//     </Box>
//   );
// }

// export default Setting;
