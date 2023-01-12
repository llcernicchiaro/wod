export const schema = {
    "models": {
        "MoveVariation": {
            "name": "MoveVariation",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "moveID": {
                    "name": "moveID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "MoveVariations",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byMove",
                        "fields": [
                            "moveID"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "public",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "Move": {
            "name": "Move",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "variation": {
                    "name": "variation",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "video": {
                    "name": "video",
                    "isArray": false,
                    "type": "AWSURL",
                    "isRequired": false,
                    "attributes": []
                },
                "modality": {
                    "name": "modality",
                    "isArray": false,
                    "type": {
                        "enum": "Modality"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "MoveVariations": {
                    "name": "MoveVariations",
                    "isArray": true,
                    "type": {
                        "model": "MoveVariation"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "moveID"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "Moves",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "public",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "Wod": {
            "name": "Wod",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "date": {
                    "name": "date",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "movements": {
                    "name": "movements",
                    "isArray": true,
                    "type": {
                        "nonModel": "Movement"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true
                },
                "time": {
                    "name": "time",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "modalities": {
                    "name": "modalities",
                    "isArray": true,
                    "type": {
                        "enum": "ModalityWeighted"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true
                },
                "totalReps": {
                    "name": "totalReps",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "priority": {
                    "name": "priority",
                    "isArray": false,
                    "type": {
                        "enum": "Priority"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "scheme": {
                    "name": "scheme",
                    "isArray": false,
                    "type": {
                        "enum": "Scheme"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "group": {
                    "name": "group",
                    "isArray": false,
                    "type": {
                        "enum": "Group"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "Wods",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "public",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    },
    "enums": {
        "Modality": {
            "name": "Modality",
            "values": [
                "GYMNASTICS",
                "MONOSTRUCTURAL",
                "WEIGHTLIFTING"
            ]
        },
        "ModalityWeighted": {
            "name": "ModalityWeighted",
            "values": [
                "GYMNASTICS",
                "MONOSTRUCTURAL",
                "WEIGHTLIFTINGLIGHT",
                "WEIGHTLIFTINGMEDIUM",
                "WEIGHTLIFTINGHEAVY"
            ]
        },
        "Group": {
            "name": "Group",
            "values": [
                "SOLO",
                "INPAIRS",
                "INTEAMSOF3",
                "INTEAMSOF4"
            ]
        },
        "Scheme": {
            "name": "Scheme",
            "values": [
                "SINGLE",
                "COUPLET",
                "TRIPLET",
                "PLUS4MOVES"
            ]
        },
        "Priority": {
            "name": "Priority",
            "values": [
                "TASK",
                "TIME",
                "WEIGHT"
            ]
        }
    },
    "nonModels": {
        "Movement": {
            "name": "Movement",
            "fields": {
                "repetitions": {
                    "name": "repetitions",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "weight": {
                    "name": "weight",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "modality": {
                    "name": "modality",
                    "isArray": false,
                    "type": {
                        "enum": "ModalityWeighted"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "time": {
                    "name": "time",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        }
    },
    "codegenVersion": "3.3.2",
    "version": "7e5070a622f3151adbb431c8b48701dc"
};