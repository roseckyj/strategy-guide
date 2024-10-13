import {
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Popover,
    Text,
    Textarea,
    useColorMode,
    useColorModeValue,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import {
    BiError,
    BiExport,
    BiMenu,
    BiMoon,
    BiReset,
    BiRightArrowAlt,
    BiSun,
    BiUndo,
    BiWalk,
} from "react-icons/bi";
import useClipboard from "react-use-clipboard";

const locations = {
    BK1: {
        name: "BK1",
        description: "Budova K",
        color: "blue",
    },
    BK2: {
        name: "BK2",
        description: "Chodba 2",
        color: "red",
    },
    BK3: {
        name: "BK3",
        description: "Průchod",
        color: "yellow",
    },
    BK4: {
        name: "BK4",
        description: "Chodba 4",
        color: "green",
    },
    BK5: {
        name: "BK5",
        description: "Budova J",
        color: "purple",
    },
    BK6: {
        name: "BK6",
        description: "Budova L",
        color: "pink",
    },
    BK7: {
        name: "BK7",
        description: "Zasedací místnost",
        color: "orange",
    },
    BK8: {
        name: "BK8",
        description: "Kancelář",
        color: "cyan",
    },
};

const LOCAL_STORAGE_KEY = "patrolling";

export type HistoryItem = {
    location: keyof typeof locations;
    timestamp?: Date;
};

export type LocalStorageType = {
    history: HistoryItem[];
    previousRuns: HistoryItem[][];
    actionHistory: {
        action: "fix" | "next" | "reset";
        timestamp: Date;
        historyBefore: HistoryItem[];
        historyAfter: HistoryItem[];
    }[];
};

export function App() {
    const colorMode = useColorMode();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const bgColor = useColorModeValue("white", "gray.900");
    const arrowColor = useColorModeValue("gray.700", "white");
    const unimportantColor = useColorModeValue("gray.300", "gray.700");
    const unimportantTextColor = useColorModeValue("gray.400", "gray.600");

    const ls = localStorage.getItem(LOCAL_STORAGE_KEY) || "";
    const [isCopied, setCopied] = useClipboard(ls, {
        successDuration: 5000,
    });

    useEffect(() => {
        const ls = updateLocalStorage((ls) => ls);
        setHistory(ls.history);
    }, []);

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

    const {
        isOpen: resetIsOpen,
        onToggle: resetOnToggle,
        onClose: resetOnClose,
    } = useDisclosure();

    const {
        isOpen: exportIsOpen,
        onToggle: exportOnToggle,
        onClose: exportOnClose,
    } = useDisclosure();

    const updateLocalStorage = (
        evaluator: (ls: LocalStorageType) => LocalStorageType
    ) => {
        const ls = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE_KEY) ||
                '{"history": [], "previousRuns": [], "actionHistory": []}'
        ) as LocalStorageType;
        const newLs = evaluator(ls);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newLs));

        return newLs;
    };

    const doFix = () => {
        const newHistory = [...history];
        newHistory.pop();

        updateLocalStorage((ls) => {
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
        let next;

        do {
            next = Object.keys(locations)[
                Math.floor(Math.random() * Object.keys(locations).length)
            ] as keyof typeof locations;
        } while (next === history[history.length - 1].location);

        newHistory[newHistory.length - 1].timestamp = new Date();
        newHistory.push({ location: next });

        updateLocalStorage((ls) => {
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

    const doReset = () => {
        updateLocalStorage((ls) => {
            ls.previousRuns.push(history);
            ls.history = [];
            ls.actionHistory.push({
                action: "reset",
                timestamp: new Date(),
                historyBefore: history,
                historyAfter: [],
            });
            return ls;
        });

        setHistory([]);

        resetOnClose();
    };

    return (
        <>
            <VStack
                bg={bgColor}
                position="fixed"
                inset={0}
                alignItems={"stretch"}
            >
                <Box padding={6} alignSelf={"end"}>
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            variant="outline"
                            aria-label="Open menu"
                            size="lg"
                            fontSize="2xl"
                            icon={<BiMenu />}
                        />
                        <MenuList>
                            <MenuItem
                                icon={
                                    colorMode.colorMode === "dark" ? (
                                        <BiSun />
                                    ) : (
                                        <BiMoon />
                                    )
                                }
                                onClick={colorMode.toggleColorMode}
                            >
                                Přepnout na{" "}
                                {colorMode.colorMode === "dark"
                                    ? "světlý"
                                    : "tmavý"}{" "}
                                režim
                            </MenuItem>
                            <MenuItem
                                icon={<BiReset />}
                                onClick={resetOnToggle}
                            >
                                Zvolit nový počáteční bod
                            </MenuItem>
                            <MenuItem
                                icon={<BiExport />}
                                onClick={exportOnToggle}
                            >
                                Exportovat historii
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
                {history.length < 2 ? (
                    <>
                        <Text
                            fontSize="3xl"
                            textAlign="center"
                            fontWeight={700}
                        >
                            Zvolte počáteční bod
                        </Text>
                        <Flex
                            gap={4}
                            flexGrow={1}
                            justifyContent="center"
                            alignContent="center"
                            flexWrap={"wrap"}
                            px={6}
                        >
                            {(
                                Object.keys(
                                    locations
                                ) as (keyof typeof locations)[]
                            ).map((location) => (
                                <Button
                                    key={location}
                                    flexShrink={0}
                                    variant="solid"
                                    aria-label={`Start at ${locations[location].name}`}
                                    size="lg"
                                    fontSize={"md"}
                                    width={32}
                                    height={24}
                                    onClick={() => {
                                        const newHistory = [
                                            {
                                                location:
                                                    location as keyof typeof locations,
                                            },
                                        ];
                                        doNext(newHistory);
                                    }}
                                >
                                    <VStack
                                        color={
                                            locations[location].color + ".500"
                                        }
                                        alignItems="stretch"
                                        w="full"
                                    >
                                        <Text
                                            fontSize="3xl"
                                            fontWeight={700 /* extra bold */}
                                            whiteSpace="nowrap"
                                            overflow="hidden"
                                            textOverflow="ellipsis"
                                        >
                                            {locations[location].name}
                                        </Text>
                                        <Text
                                            fontSize="0.9em"
                                            whiteSpace="nowrap"
                                            overflow="hidden"
                                            textOverflow="ellipsis"
                                        >
                                            {locations[location].description}
                                        </Text>
                                    </VStack>
                                </Button>
                            ))}
                        </Flex>
                    </>
                ) : (
                    <>
                        <Flex flexGrow={1}>
                            <HStack w="full" my="auto" h={32} spacing={0}>
                                <Box
                                    w="16"
                                    position="relative"
                                    h="10px"
                                    flexShrink={0}
                                >
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
                                        locations[
                                            history[history.length - 2].location
                                        ].color + ".500"
                                    }
                                    color={
                                        locations[
                                            history[history.length - 2].location
                                        ].color + ".500"
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
                                            {
                                                locations[
                                                    history[history.length - 2]
                                                        .location
                                                ].name
                                            }
                                        </Text>
                                        <Text lineHeight="1em" fontSize="0.9em">
                                            {
                                                locations[
                                                    history[history.length - 2]
                                                        .location
                                                ].description
                                            }
                                        </Text>
                                        <Text fontSize="0.9em" opacity={0.5}>
                                            {moment(
                                                history[history.length - 2]
                                                    .timestamp
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
                                            transformOrigin:
                                                "calc(100% - 5px) 50%",
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
                                            transformOrigin:
                                                "calc(100% - 5px) 50%",
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
                                        locations[
                                            history[history.length - 1].location
                                        ].color + ".500"
                                    }
                                    color={
                                        locations[
                                            history[history.length - 1].location
                                        ].color + ".500"
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
                                            {
                                                locations[
                                                    history[history.length - 1]
                                                        .location
                                                ].name
                                            }
                                        </Text>
                                        <Text lineHeight="1em" fontSize="0.9em">
                                            {
                                                locations[
                                                    history[history.length - 1]
                                                        .location
                                                ].description
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
                                onClick={() =>
                                    history.length > 2 && fixOnToggle()
                                }
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
                    </>
                )}
            </VStack>
            <Popover
                isOpen={resetIsOpen}
                onOpen={resetOnToggle}
                onClose={resetOnClose}
            >
                <Modal isOpen={resetIsOpen} onClose={resetOnClose} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Zvolit nový počáteční bod</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <HStack color="yellow.500">
                                <Icon as={BiError} fontSize="5xl" />
                                <Text>
                                    Opravdu chcete smazat dosavadní průchod a
                                    zvolit nový počáteční bod?
                                    <br />
                                    <br />
                                    Tato akce je nevratná!
                                </Text>
                            </HStack>
                        </ModalBody>

                        <ModalFooter>
                            <HStack>
                                <Button variant="ghost" onClick={resetOnClose}>
                                    Ne
                                </Button>
                                <Button colorScheme="blue" onClick={doReset}>
                                    Ano
                                </Button>
                            </HStack>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

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

                <Modal isOpen={exportIsOpen} onClose={exportOnClose} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Exportovat historii</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Textarea value={ls} isReadOnly w="full" h={64} />
                        </ModalBody>

                        <ModalFooter>
                            <HStack>
                                <Button onClick={() => setCopied()}>
                                    {isCopied
                                        ? "Zkopírováno!"
                                        : "Zkopírovat obsah"}
                                </Button>
                                <Button
                                    colorScheme="blue"
                                    onClick={exportOnClose}
                                >
                                    Hotovo
                                </Button>
                            </HStack>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Popover>
        </>
    );
}
