export function setupListViewportCameras(scene, lists) {
  lists.forEach(({ key, content, layout }) => {
    const { listLeft, listTop, listWidth, visibleListHeight } = layout;
    scene.cameras.main.ignore(content);
    const camera = scene.cameras.add(listLeft, listTop, listWidth, visibleListHeight);
    camera.setBackgroundColor('rgba(0,0,0,0)');
    camera.setScroll(listLeft, listTop);
    camera.ignore(scene.children.list.filter((obj) => obj !== content));
    scene[key] = camera;
  });

  lists.forEach(({ key, content }) => {
    lists.forEach(({ key: otherKey, content: otherContent }) => {
      if (key === otherKey) {
        return;
      }
      scene[key].ignore(otherContent);
      scene[otherKey].ignore(content);
    });
  });
}
