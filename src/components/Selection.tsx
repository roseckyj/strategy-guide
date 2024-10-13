import { Button, Flex, Text, VStack } from "@chakra-ui/react";
import { LocalStorageManager } from "../managers/LocalStorageManager";
import { StrategyManager } from "../managers/StrategyManager";
import { HistoryItem, LocalStorageType } from "./App";

export interface ISelectionProps {
    history: HistoryItem[];
    localStorageManager: LocalStorageManager<LocalStorageType>;
    setHistory: (history: HistoryItem[]) => void;
    strategyManager: StrategyManager;
}

export function Selection({ setHistory, strategyManager }: ISelectionProps) {
    return (
        <>
            <Text fontSize="3xl" textAlign="center" fontWeight={700}>
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
                {strategyManager.locations.map((location, key) => (
                    <Button
                        key={key}
                        flexShrink={0}
                        variant="solid"
                        aria-label={`Start at ${location.name}`}
                        size="lg"
                        fontSize={"md"}
                        width={32}
                        height={24}
                        onClick={() => {
                            const newNode =
                                strategyManager.generateStarting(location);

                            const newHistory = [
                                {
                                    location: newNode.id,
                                },
                            ];
                            const next = strategyManager.generateNext(
                                newHistory[0].location
                            );
                            newHistory.push({
                                location: next.id,
                            });
                            setHistory(newHistory);
                        }}
                    >
                        <VStack
                            color={location.color + ".500"}
                            alignItems="stretch"
                            w="full"
                        >
                            {location.name ? (
                                <Text
                                    fontSize="3xl"
                                    fontWeight={700 /* extra bold */}
                                    whiteSpace="nowrap"
                                    overflow="hidden"
                                    textOverflow="ellipsis"
                                >
                                    {location.name}
                                </Text>
                            ) : (
                                <Text
                                    fontSize="lg"
                                    fontWeight={700 /* extra bold */}
                                    whiteSpace="nowrap"
                                    overflow="hidden"
                                    textOverflow="ellipsis"
                                >
                                    {location.id}
                                </Text>
                            )}
                            <Text
                                fontSize="0.9em"
                                whiteSpace="nowrap"
                                overflow="hidden"
                                textOverflow="ellipsis"
                            >
                                {location.description}
                            </Text>
                        </VStack>
                    </Button>
                ))}
            </Flex>
        </>
    );
}
