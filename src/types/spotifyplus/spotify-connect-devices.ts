import { ISpotifyConnectDevice } from './spotify-connect-device';

/**
 * Spotify Connect Devices collection.
 */
export interface ISpotifyConnectDevices {

  /** 
   * Number of seconds between the current date time and the `DateLastRefreshed` property value.
   */
  AgeLastRefreshed: number;


  /**
   * Date and time the device list was last refreshed, in unix epoch format (e.g. 1669123919.331225).
   */
  DateLastRefreshed: number;


  /** 
   * Array of `ISpotifyConnectDevice` objects.
   */
  Items: Array<ISpotifyConnectDevice>;


  /** 
   * Number of objects in the `Items` property array.
   */
  ItemsCount: number;


  /** 
   * Date and time (in epoch format) of when the list was last updated.  
   * Note that this attribute does not exist in the service response.  It was added here for convenience.
   * Used by SpotifyPlusCard only.
   */
  lastUpdatedOn?: number;

}


//    def ContainsDeviceId(self, value:str) -> bool:
//        """
//        Returns True if the `Items` collection contains the specified device id value;
//        otherwise, False.

//        Alias entries (if any) are also compared.
//        """
//        scDevice:SpotifyConnectDevice = self.GetDeviceById(value)
//        if scDevice is not None:
//            return True
//        return False


//    def ContainsDeviceName(self, value:str) -> bool:
//        """
//        Returns True if the `Items` collection contains the specified device name value;
//        otherwise, False.

//        Alias entries (if any) are also compared.
//        """
//        scDevice:SpotifyConnectDevice = self.GetDeviceByName(value)
//        if scDevice is not None:
//            return True
//        return False


//    def ContainsZeroconfEndpointGetInformation(self, value:str) -> bool:
//        """
//        Returns True if the `Items` collection contains the specified Zeroconf getInfo Endpoint url value;
//        otherwise, False.
//        """
//        result:bool = False
//        if value is None:
//            return result

//        # convert case for comparison.
//        value = value.lower()

//        # process all discovered devices.
//        scDevice:SpotifyConnectDevice
//        for scDevice in self._Items:
//            if (scDevice.DiscoveryResult.ZeroconfApiEndpointGetInformation.lower() == value):
//                result = True
//                break
//        return result


//    def GetDeviceById(self, value:str) -> bool:
//        """
//        Returns a `SpotifyConnectDevice` instance if the `Items` collection contains the specified
//        device id value; otherwise, None.

//        Alias entries (if any) are also compared.
//        """
//        result:SpotifyConnectDevice = None
//        if value is None:
//            return result

//        # convert case for comparison.
//        value = value.lower()

//        # process all discovered devices.
//        scDevice:SpotifyConnectDevice
//        for scDevice in self._Items:
//            if (scDevice.DeviceInfo.HasAliases):
//                scAlias:ZeroconfGetInfoAlias
//                for scAlias in scDevice.DeviceInfo.Aliases:
//                    if (scAlias.Id.lower() == value):
//                        result = scDevice
//                        break
//                if result:
//                    break
//            else:
//                if (scDevice.DeviceInfo.DeviceId.lower() == value):
//                    result = scDevice
//                    break
//        return result


//    def GetDeviceByName(self, value:str) -> bool:
//        """
//        Returns a `SpotifyConnectDevice` instance if the `Items` collection contains the specified
//        device name value; otherwise, None.

//        Alias entries (if any) are also compared.
//        """
//        result:SpotifyConnectDevice = None
//        if value is None:
//            return result

//        # convert case for comparison.
//        value = value.lower()

//        # process all discovered devices.
//        scDevice:SpotifyConnectDevice
//        for scDevice in self._Items:
//            if (scDevice.DeviceInfo.HasAliases):
//                scAlias:ZeroconfGetInfoAlias
//                for scAlias in scDevice.DeviceInfo.Aliases:
//                    if (scAlias.Name.lower() == value):
//                        result = scDevice
//                        break
//                if result is not None:
//                    break
//            else:
//                if (scDevice.DeviceInfo.RemoteName.lower() == value):
//                    result = scDevice
//                    break
//        return result


//    def GetDeviceList(self) -> list[Device]:
//        """
//        Returns a list of `Device` objects that can be used to build a selection list
//        of available devices.

//        Note that the `Device` object has the following properties populated:
//        Id, Name, IsActive, Type.
//        """
//        result:list[Device] = []

//        # process all discovered devices.
//        scDevice:SpotifyConnectDevice
//        for scDevice in self._Items:

//            # map device information details.
//            info:ZeroconfGetInfo = scDevice.DeviceInfo

//            # create new mock device.
//            device = Device()
//            device.Type = info.DeviceType

//            # are aliases being used (RemoteName is null if so)?
//            if info.RemoteName is None:

//                # if aliases are defined, then use the alias details.
//                infoAlias:ZeroconfGetInfoAlias
//                for infoAlias in info.Aliases:
//                    device.Id = infoAlias.Id
//                    device.Name = infoAlias.Name

//            else:

//                # if no aliases then use the remote name and id.
//                device.Id = info.DeviceId
//                device.Name = info.RemoteName

//            # append device to results.
//            result.append(device)

//        # sort items on Name property, ascending order.
//        if len(result) > 0:
//            result.sort(key=lambda x: (x.Name or "").lower(), reverse=False)

//        return result
