import { getRepoContents } from 'backend/github-api';

\.onReady(async () => {
  try {
    // Fetch root contents of your repo
    const contents = await getRepoContents(\"jimlangford\",\"12-Stones-Velo-System\",\"/\");

    // Populate the table
    \('#repoTable').rows = contents.map(file => ({
      name:        file.name,
      type:        file.type,
      size:        file.size ? \\ bytes\ : '',
      path:        file.path,
      downloadUrl: file.download_url
    }));
  } catch (err) {
    console.error('GitHub API error:', err);
  }
});
