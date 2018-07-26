# Just Another DataBase Abstractor

Abtract your data across multiple databases using YAML definitions.

### Purpose

The purposes of this library is to streamline the processes of modern web systems. It does this by following a couple of guidelines that allow it to do the most with the least amount of code

##### Declarative Definition Files
The library uses YAML files to describe the data structure. Each of these "maps" contains both a list of fields, along with descriptors that enable better abtraction, but also a list of databases and indexes to each these maps must be saved. The library handles saving the appropriate fields only to the locations specified

##### Save Once, Save Everywhere
When you save an object, it automatically writes the updated data appropriately to the linked databases. It will not waste writes to databases without updated data.

##### Search Across Database Types
Want to perform a search that relies on multiple types of databases? That's no big deal! You just set up the search you want, it'll worry about getting you your results

##### Abtract Models
Automatically turn the data into a DAO. Primitive types are ensured and automatically converted for your convenience. 
Also, just `save` the model to push the data back
