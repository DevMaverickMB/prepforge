export const DSA_PATTERNS = [
  "arrays",
  "strings",
  "two_pointers",
  "sliding_window",
  "binary_search",
  "stacks",
  "linked_list",
  "trees",
  "graphs",
  "heap",
  "dp",
  "trie",
  "backtracking",
  "union_find",
  "segment_tree",
] as const;

export type DSAPattern = (typeof DSA_PATTERNS)[number];

export const PATTERN_LABELS: Record<DSAPattern, string> = {
  arrays: "Arrays",
  strings: "Strings",
  two_pointers: "Two Pointers",
  sliding_window: "Sliding Window",
  binary_search: "Binary Search",
  stacks: "Stacks",
  linked_list: "Linked List",
  trees: "Trees",
  graphs: "Graphs",
  heap: "Heap / Priority Queue",
  dp: "Dynamic Programming",
  trie: "Trie",
  backtracking: "Backtracking",
  union_find: "Union Find",
  segment_tree: "Segment Tree",
};

export const LC_SOURCES = [
  "striver_a2z",
  "neetcode_150",
  "blind_75",
  "company_tagged",
  "other",
] as const;

export const LC_SOURCE_LABELS: Record<string, string> = {
  striver_a2z: "Striver A2Z",
  neetcode_150: "NeetCode 150",
  blind_75: "Blind 75",
  company_tagged: "Company Tagged",
  other: "Other",
};
