import {
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useColorModeValue,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import moment from "moment";
import { BiError, BiRightArrowAlt, BiUndo, BiWalk } from "react-icons/bi";
import { LocalStorageManager } from "../managers/LocalStorageManager";
import { StrategyManager } from "../managers/StrategyManager";
import { HistoryItem, LocalStorageType } from "./App";

export interface IWalkingProps {
    history: HistoryItem[];
    localStorageManager: LocalStorageManager<LocalStorageType>;
    setHistory: (history: HistoryItem[]) => void;
    strategyManager: StrategyManager;
}

export function Walking({
    history,
    setHistory,
    strategyManager,
    localStorageManager,
}: IWalkingProps) {
    const bgColor = useColorModeValue("white", "gray.900");
    const arrowColor = useColorModeValue("gray.700", "white");
    const unimportantColor = useColorModeValue("gray.300", "gray.700");
    const unimportantTextColor = useColorModeValue("gray.400", "gray.600");

    const {
        isOpen: fixIsOpen,
        onToggle: fixOnToggle,
        onClose: fixOnClose,
    } = useDisclosure();

    const {
        isOpen: nextIsOpen,
        onToggle: nextOnToggle,
        onClose: nextOnClose,
    } = useDisclosure();

    const doFix = () => {
        const newHistory = [...history];
        newHistory.pop();

        localStorageManager.update((ls) => {
            ls.history = newHistory;
            ls.actionHistory.push({
                action: "fix",
                timestamp: new Date(),
                historyBefore: history,
                historyAfter: newHistory,
            });
            return ls;
        });

        setHistory(newHistory);
        fixOnClose();
    };

    const doNext = (history: HistoryItem[]) => {
        const newHistory = [...history];
        const next = strategyManager.generateNext(
            history[history.length - 1].location
        );

        newHistory[newHistory.length - 1].timestamp = new Date();
        newHistory.push({ location: next.id });

        localStorageManager.update((ls) => {
            ls.history = newHistory;
            ls.actionHistory.push({
                action: "next",
                timestamp: new Date(),
                historyBefore: history,
                historyAfter: newHistory,
            });
            return ls;
        });

        setHistory(newHistory);
        nextOnClose();
    };

    return (
        <>
            <Flex flexGrow={1}>
                <HStack w="full" my="auto" h={32} spacing={0}>
                    <Box w="16" position="relative" h="10px" flexShrink={0}>
                        <Box
                            position="absolute"
                            top={0}
                            bottom={0}
                            left={-1}
                            right={-1}
                            zIndex={-1}
                            bg={unimportantColor}
                        ></Box>
                    </Box>
                    <Box
                        borderRadius="full"
                        borderStyle="solid"
                        borderWidth="10px"
                        bg={bgColor}
                        borderColor={
                            (strategyManager.get(
                                history[history.length - 2].location
                            ).parent.color || "gray") + ".500"
                        }
                        color={
                            (strategyManager.get(
                                history[history.length - 2].location
                            ).parent.color || "gray") + ".500"
                        }
                        w={12}
                        h={12}
                        flexShrink={0}
                        position="relative"
                    >
                        <VStack
                            position="absolute"
                            top={12}
                            left={-12}
                            right={-12}
                            alignItems="center"
                            spacing={1}
                            textAlign="center"
                        >
                            <Text
                                fontSize="3xl"
                                fontWeight={700 /* extra bold */}
                            >
                                {strategyManager.get(
                                    history[history.length - 2].location
                                ).parent.name ||
                                    strategyManager.get(
                                        history[history.length - 2].location
                                    ).parent.id}
                            </Text>
                            <Text lineHeight="1em" fontSize="0.9em">
                                {
                                    strategyManager.get(
                                        history[history.length - 2].location
                                    ).parent.description
                                }
                            </Text>
                            <Text fontSize="0.9em" opacity={0.5}>
                                {moment(
                                    history[history.length - 2].timestamp
                                ).format("HH:mm:ss")}
                            </Text>
                        </VStack>
                        <VStack
                            position="absolute"
                            bottom={14}
                            left={-8}
                            right={-8}
                            alignItems="center"
                            spacing={1}
                            textAlign="center"
                            color={unimportantTextColor}
                        >
                            <Text lineHeight="1em" fontSize="0.9em">
                                Předchozí kontrolní bod
                            </Text>
                        </VStack>
                    </Box>
                    <Box
                        flexGrow={1}
                        flexShrink={1}
                        position="relative"
                        h="10px"
                    >
                        <Box
                            position="absolute"
                            top={0}
                            bottom={0}
                            left={-1}
                            right={5}
                            zIndex={-1}
                            bg={arrowColor}
                            _after={{
                                /* Create the arrow */
                                content: '""',
                                position: "absolute",
                                top: 0,
                                right: "-5px",
                                bottom: 0,
                                width: "30px",
                                zIndex: -1,
                                transformOrigin: "calc(100% - 5px) 50%",
                                transform: "rotate(45deg)",
                                background: arrowColor,
                            }}
                            _before={{
                                /* Create the arrow */
                                content: '""',
                                position: "absolute",
                                top: 0,
                                right: "-5px",
                                bottom: 0,
                                width: "30px",
                                zIndex: -1,
                                transformOrigin: "calc(100% - 5px) 50%",
                                transform: "rotate(-45deg)",
                                background: arrowColor,
                            }}
                        ></Box>
                        <Icon
                            as={BiWalk}
                            fontSize="60px"
                            color={arrowColor}
                            position="absolute"
                            bottom={2}
                            right="50%"
                            transform="translateX(45%)"
                        />
                    </Box>
                    <Box
                        borderRadius="full"
                        borderStyle="solid"
                        borderWidth="15px"
                        bg={bgColor}
                        borderColor={
                            (strategyManager.get(
                                history[history.length - 1].location
                            ).parent.color || "gray") + ".500"
                        }
                        color={
                            (strategyManager.get(
                                history[history.length - 1].location
                            ).parent.color || "gray") + ".500"
                        }
                        w={20}
                        h={20}
                        flexShrink={0}
                        position="relative"
                    >
                        <VStack
                            position="absolute"
                            top={16}
                            left={-12}
                            right={-12}
                            alignItems="center"
                            spacing={1}
                            textAlign="center"
                        >
                            <Text
                                fontSize="5xl"
                                fontWeight={700 /* extra bold */}
                                mb={-1}
                            >
                                {strategyManager.get(
                                    history[history.length - 1].location
                                ).parent.name ||
                                    strategyManager.get(
                                        history[history.length - 1].location
                                    ).parent.id}
                            </Text>
                            <Text lineHeight="1em" fontSize="0.9em">
                                {
                                    strategyManager.get(
                                        history[history.length - 1].location
                                    ).parent.description
                                }
                            </Text>
                            {/* <Text fontSize="0.9em" opacity={0.5}>
                                    ETA 13:45:10
                                </Text> */}
                        </VStack>
                        <VStack
                            position="absolute"
                            bottom={20}
                            left={-8}
                            right={-8}
                            alignItems="center"
                            spacing={1}
                            textAlign="center"
                            color={unimportantTextColor}
                        >
                            <Text lineHeight="1em" fontSize="0.9em">
                                Následující kontrolní bod
                            </Text>
                        </VStack>
                    </Box>
                    <Box w="16"></Box>
                </HStack>
            </Flex>
            <HStack
                padding={6}
                spacing={4}
                justifyItems="stretch"
                alignItems="stretch"
                flexWrap={"wrap"}
            >
                <Button
                    flexGrow={1}
                    flexShrink={0}
                    variant="outline"
                    aria-label="Open menu"
                    size="lg"
                    fontSize={"md"}
                    leftIcon={<BiUndo />}
                    onClick={() => history.length > 2 && fixOnToggle()}
                    isDisabled={history.length <= 2}
                >
                    Opravit zadání
                </Button>

                <Button
                    flexGrow={1}
                    flexShrink={0}
                    variant="solid"
                    aria-label="Next point"
                    size="lg"
                    fontSize={"md"}
                    leftIcon={<BiRightArrowAlt />}
                    onClick={() => nextOnToggle()}
                >
                    Následující bod
                </Button>
            </HStack>

            <Modal isOpen={fixIsOpen} onClose={fixOnClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Opravit zadání</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <HStack color="yellow.500">
                            <Icon as={BiError} fontSize="5xl" />
                            <Text>
                                Opravdu se chcete vrátit na předchozí bod?
                            </Text>
                        </HStack>
                    </ModalBody>

                    <ModalFooter>
                        <HStack>
                            <Button variant="ghost" onClick={fixOnClose}>
                                Ne
                            </Button>
                            <Button colorScheme="blue" onClick={doFix}>
                                Ano
                            </Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={nextIsOpen} onClose={nextOnClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Následující bod</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Opravdu chcete pokračovat na následující bod?
                    </ModalBody>

                    <ModalFooter>
                        <HStack>
                            <Button variant="ghost" onClick={nextOnClose}>
                                Ne
                            </Button>
                            <Button
                                colorScheme="blue"
                                onClick={() => doNext(history)}
                            >
                                Ano
                            </Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
