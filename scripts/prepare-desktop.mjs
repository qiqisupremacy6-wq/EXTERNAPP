import fs from 'node:fs/promises';
await fs.cp(new URL('../dist/client/',import.meta.url),new URL('../desktop/ui/',import.meta.url),{recursive:true});
