Key Features Implemented

1. Device Management


Device Creation:

Users can create a new device by providing details such as device name, type, building name, and part number.

Validation checks ensure mandatory fields are filled before submission.

The saveDevices method in the DevicesService handles device creation and updates the device list dynamically.



Device Update:

Users can update the details of an existing device, including its name, type, building name, and part number.

The updateDevice method ensures the device data is updated both in the backend and the local state.



Device Deletion:

Devices can be deleted after user confirmation through a dialog box.

The deleteDevice method removes the device from the backend and updates the local device list.



Device Search:

Users can search devices by various criteria such as device ID, name, type, building name, or part number.

The search functionality dynamically updates the device list based on the search results.



Device Summary Page:

A detailed view of a specific device, including its shelf positions, is provided.

Users can update device details, add new shelf positions,attach/detach shelfs or delete the device from this page.




2. Shelf Management


Shelf Creation:

Users can create new shelves by providing the shelf name and part number.

Validation checks ensure required fields are entered before submission.

The saveShelf method in the ShelfService handles shelf creation and updates the local shelf list.



Shelf Update:

Users can update the shelf name and part number.

The updateShelf method ensures the shelf data is updated in the backend and local state.



Shelf Deletion:

Shelves can be deleted after user confirmation through a dialog box.

The deleteShelf method removes the shelf from the backend and updates the local shelf list.



Shelf Search:

Users can search shelves by shelf ID or name.

The search functionality dynamically updates the shelf list based on the search results.



Shelf Summary Page:

A detailed view of a specific shelf is provided, showing its ID, name, part number, creation date, and update date.

Users can update or delete the shelf from this page.




3. Shelf Position Management


Add Shelf Positions:

Users can add new shelf positions to a device from the device summary page.

The addShelfPosition method creates a new shelf position in the backend and updates the local state.



Attach/Detach Shelves:

Users can attach or detach shelves to/from a shelf position.

The attachShelf and detachShelf methods handle these operations and dynamically update the shelf position list.



Delete Shelf Positions:

Shelf positions can be deleted from the device summary page.

The deleteShelf method ensures the removal of the shelf position from the backend and local state.


4. Home Page

Implementation of real time updates using RxJS. Using RxJS one can see the updates without refreshing the page (except deletion of shelf or device).