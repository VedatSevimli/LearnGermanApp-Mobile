import { Verb } from '../modules/verbs/verbs.type';
import { verbsForSorting } from './verbsforSortingA1';

export const sortedVerbObjects = (
    verbObjects: Verb[],
    verbsForSorting: string[]
): Verb[] => {
    return verbObjects.sort((a, b) => {
        const indexA = verbsForSorting.indexOf(a.word);
        const indexB = verbsForSorting.indexOf(b.word);
        return indexA - indexB;
    });
};

export const sortVerbsOrderLerning = (verbs: Verb[]) => {
    //just sort array order to learning order.
    const verbIndexMap: { [key: string]: number } = {};
    verbsForSorting.forEach((verb, index) => {
        verbIndexMap[verb] = index;
    });

    // Sort the verbObjects array based on the order of verbs in verbsForSorting
    const sortedVerbObjects = verbs
        .filter((w) => verbsForSorting.includes(w.word))
        .sort((a, b) => {
            const indexA = verbIndexMap[a.word as string];
            const indexB = verbIndexMap[b.word];
            return indexA - indexB;
        });
    return sortedVerbObjects;
};
