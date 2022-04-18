#Real Time defined exceptions

class NotConfigured(Exception):
    #Indicates a missing configuration in Setting
    pass

class NoSpecificationFound(Exception):
    #No Specification was found in the database
    pass