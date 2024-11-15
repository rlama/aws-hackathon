#!/bin/sh

# Create new project readme
touch ./NEW-README.md

# Add project overview to head of project's readme
cat ./overview.md >> ./NEW-README.md

# Add sections to project readme
cat ./base/README.md >> ./NEW-README.md
cat ./layouts/README.md >> ./NEW-README.md
cat ./modules/README.md >> ./NEW-README.md
cat ./assets/README.md >> ./NEW-README.md

# Overwrite existing readme
mv ./NEW-README.md ./README.md
