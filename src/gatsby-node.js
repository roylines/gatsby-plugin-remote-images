// todo: add tests?
const { createRemoteFileNode } = require(`gatsby-source-filesystem`);
const get = require("lodash/get");

exports.onCreateNode = async (
  { node, actions, store, cache, createNodeId },
  options
) => {
  const { createNode } = actions;
  const {
    nodeType,
    imagePath,
    getUrl,
    name = "localImage",
    auth = {},
    ext = null
  } = options;

  let fileNode;
  if (node.internal.type === nodeType) {


    // use options.imagePath to derive url
    // if not set, try options.getUrl()
    let url
    if (imagePath) {
      url = ext ? `${get(node, imagePath)}${ext}` : get(node, imagePath);
    } else if (typeof getUrl == 'function') {
      url = getUrl(node);
    }

    try {
      fileNode = await createRemoteFileNode({
        url,
        parentNodeId: node.id,
        store,
        cache,
        createNode,
        createNodeId,
        auth,
        ext
      });
    } catch (e) {
      console.error("gatsby-plugin-remote-images ERROR:", e);
    }
  }
  // Adds a field `localImage` or custom name to the node
  // ___NODE appendix tells Gatsby that this field will link to another node
  if (fileNode) {
    node[`${name}___NODE`] = fileNode.id;
  }
};
