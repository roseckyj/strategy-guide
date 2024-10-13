import {
    Box,
    Button,
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
import { useEffect, useMemo, useState } from "react";
import {
    BiError,
    BiExport,
    BiMenu,
    BiMoon,
    BiReset,
    BiSun,
} from "react-icons/bi";
import useClipboard from "react-use-clipboard";
import { LocalStorageManager } from "../managers/LocalStorageManager";
import { StrategyManager } from "../managers/StrategyManager";
import { Selection } from "./Selection";
import { Walking } from "./Walking";

export type HistoryItem = {
    location: string;
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

    const localStorageManager = useMemo(
        () =>
            new LocalStorageManager<LocalStorageType>("patrolling", {
                history: [],
                previousRuns: [],
                actionHistory: [],
            }),
        []
    );

    const strategy = useMemo(() => new StrategyManager(), []);

    const [isCopied, setCopied] = useClipboard(localStorageManager.raw, {
        successDuration: 5000,
    });

    useEffect(() => {
        const ls = localStorageManager.parsed;
        setHistory(ls.history);
    }, [localStorageManager]);

    const doReset = () => {
        localStorageManager.update((ls) => {
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
                    <Selection
                        history={history}
                        localStorageManager={localStorageManager}
                        setHistory={setHistory}
                        strategyManager={strategy}
                    />
                ) : (
                    <Walking
                        history={history}
                        localStorageManager={localStorageManager}
                        setHistory={setHistory}
                        strategyManager={strategy}
                    />
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

                <Modal isOpen={exportIsOpen} onClose={exportOnClose} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Exportovat historii</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Textarea
                                value={localStorageManager.raw}
                                isReadOnly
                                w="full"
                                h={64}
                            />
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
