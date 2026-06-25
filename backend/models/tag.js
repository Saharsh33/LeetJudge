const Tag = Object.freeze({
  ARRAYS: 'Arrays',
  TREES: 'Trees',
  GRAPHS: 'Graphs',
  DYNAMIC_PROGRAMMING: 'Dynamic Programming',
  TEST_TAG: 'Test Tag',
});

export const getAllTags = () => Object.values(Tag);

export default Tag;
