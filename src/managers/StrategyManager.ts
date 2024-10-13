import strategy from "../strategy.json";

export type Location = {
    id: string;
    name?: string;
    description?: string;
    color?: string;
    nodes?: {
        id: string;
    }[];
};

export type Node = {
    id: string;
};

export class StrategyManager {
    strategy;

    constructor() {
        this.strategy = strategy;
    }

    generateNext(last: string): Node {
        /* Select random node */
        const possible = this.strategy.graph.edges.filter(
            (e) => e.src === last
        );

        // Choose next according to probability distribution at edge.probability
        const totalProbability = possible.reduce(
            (acc, cur) => acc + cur.probability,
            0
        );
        const random = Math.random() * totalProbability;
        let sum = 0;
        let next = "";
        for (const edge of possible) {
            sum += edge.probability;
            if (random < sum) {
                next = edge.tgt;
                break;
            }
        }

        return this.get(next).node as Node;
    }

    generateStarting(location: Location): Node {
        const next =
            location.nodes![Math.floor(Math.random() * location.nodes!.length)];
        return this.get(next.id).node as Node;
    }

    get locations(): Location[] {
        return this.strategy.graph.nodes.filter(
            (node) => node.nodes
        ) as unknown as Location[];
    }

    get nodes(): Node[] {
        return this.strategy.graph.nodes.filter(
            (node) => !node.nodes
        ) as unknown as Node[];
    }

    get(id: string): {
        node: Node;
        parent: Location;
    } {
        return {
            node: this.nodes.find((l) => l.id === id) as Location,
            parent: this.locations.find((l) =>
                l.nodes?.find((n) => n.id === id)
            ) as Location,
        };
    }
}
