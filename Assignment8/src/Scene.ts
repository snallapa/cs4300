export function hogwartsOfficial() {
  return `{
      "scaleinstances": "false",
      "instances": [
        {
          "name": "sphere",
          "path": "models/sphere.obj"
        },
        {
          "name": "box",
          "path": "models/box.obj"
        },
        {
          "name": "cylinder",
          "path": "models/cylinder.obj"
        },
        {
          "name": "cone",
          "path": "models/cone.obj"
        },
        {
          "name": "aeroplane",
          "path":"models/aeroplane.obj"
        }
      ],
      "images": [{
        "name" : "brick",
        "path" : "textures/brickbetter.png"
      },
      {
        "name" : "roof",
        "path" : "textures/roof.jpg"
      }
    ],
      "root": {
        "type": "group",
        "name": "Root of scene graph",
        "lights": [
          {
            "ambient": [
              0.8,
              0.8,
              0.8
            ],
            "diffuse": [
              0.3,
              0.3,
              0.3
            ],
            "specular": [
              0.3,
              0.3,
              0.3
            ],
            "position": [
              40,
              100,
              -45,
              1.0
            ]
          },
          {
            "ambient": [
              0.2,
              0.2,
              0.2
            ],
            "diffuse": [
              0.2,
              0.2,
              0.2
            ],
            "specular": [
              0.2,
              0.2,
              0.2
            ],
            "position": [
              105,
              50,
              -45,
              1.0
            ]
          }
        ],
        "children": [
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  5.0,
                  25.0,
                  -5.0
                ]
              },
              {
                "scale": [
                  10.0,
                  50.0,
                  10.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "box", 
              "texture": "brick",
              "texturetransform" : [{"scale": [5,1,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  5.0,
                  50.0,
                  -5.0
                ]
              },
              {
                "scale": [
                  5.0,
                  5.0,
                  5.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cylinder",
              "texturetransform" : [{"scale": [3,0.5,1]}],
              "texture": "brick",
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  5.0,
                  55.0,
                  -5.0
                ]
              },
              {
                "scale": [
                  5.0,
                  10.0,
                  5.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cone",
              "texture": "roof",
              "texturetransform" : [{"scale": [1.2,0.8,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  20.0,
                  25.0,
                  -5.0
                ]
              },
              {
                "scale": [
                  10.0,
                  50.0,
                  10.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "box", 
              "texture": "brick",
              "texturetransform" : [{"scale": [5,1,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  20.0,
                  50.0,
                  -5.0
                ]
              },
              {
                "scale": [
                  5.0,
                  5.0,
                  5.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cylinder",
              "texturetransform" : [{"scale": [3,0.5,1]}],
              "texture": "brick",
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  20.0,
                  55.0,
                  -5.0
                ]
              },
              {
                "scale": [
                  5.0,
                  10.0,
                  5.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cone",
              "texture": "roof",
              "texturetransform" : [{"scale": [1.2,0.8,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  12.5,
                  10.0,
                  -27.5
                ]
              },
              {
                "scale": [
                  15.0,
                  20.0,
                  35.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "box", 
              "texture": "brick",
              "texturetransform" : [{"scale": [2.5,1.5,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  30.0,
                  10.0,
                  -27.5
                ]
              },
              {
                "scale": [
                  20.0,
                  20.0,
                  35.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "box", "texture": "brick",
              "texturetransform" : [{"scale": [2.5,2,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  12.5,
                  10.0,
                  -57.5
                ]
              },
              {
                "scale": [
                  25.0,
                  20.0,
                  25.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "box", 
              "texture": "brick",
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  12.5,
                  20.0,
                  -57.5
                ]
              },
              {
                "scale": [
                  11.0,
                  25.0,
                  11.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cylinder",
              "texturetransform" : [{"scale": [4.5,2,1]}],
              "texture": "brick",
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  12.5,
                  45.0,
                  -57.5
                ]
              },
              {
                "scale": [
                  10.0,
                  40.0,
                  10.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cylinder",
              "texturetransform" : [{"scale": [4.5,4,1]}],
              "texture": "brick",
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  12.5,
                  85.0,
                  -57.5
                ]
              },
              {
                "scale": [
                  10.0,
                  20.0,
                  10.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cone",
              "texture": "roof",
              "texturetransform" : [{"scale": [1.5,1,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  12.5,
                  30.0,
                  -67.5
                ]
              },
              {
                "scale": [
                  4.0,
                  30.0,
                  4.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cylinder",
              "texture": "brick",
              "texturetransform" : [{"scale": [2,2.5,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  12.5,
                  60.0,
                  -67.5
                ]
              },
              {
                "scale": [
                  4.0,
                  10.0,
                  4.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cone",
              "texturetransform" : [{"scale": [0.8,0.6,1]}],
              "texture": "roof",
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  12.5,
                  30.0,
                  -47.5
                ]
              },
              {
                "scale": [
                  4.0,
                  30.0,
                  4.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cylinder",
              "texturetransform" : [{"scale": [2,2.5,1]}],
              "texture": "brick",
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  12.5,
                  60.0,
                  -47.5
                ]
              },
              {
                "scale": [
                  4.0,
                  10.0,
                  4.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cone",
              "texturetransform" : [{"scale": [0.8,0.6,1]}],
              "texture": "roof",
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  22.5,
                  30.0,
                  -57.5
                ]
              },
              {
                "scale": [
                  4.0,
                  30.0,
                  4.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cylinder",
              "texturetransform" : [{"scale": [2,2.5,1]}],
              "texture": "brick",
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  22.5,
                  60.0,
                  -57.5
                ]
              },
              {
                "scale": [
                  4.0,
                  10.0,
                  4.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cone",
              "texturetransform" : [{"scale": [0.8,0.6,1]}],
              "texture": "roof",
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  2.5,
                  30.0,
                  -57.5
                ]
              },
              {
                "scale": [
                  4.0,
                  30.0,
                  4.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cylinder",
              "texturetransform" : [{"scale": [2,2.5,1]}],
              "texture": "brick",
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  2.5,
                  60.0,
                  -57.5
                ]
              },
              {
                "scale": [
                  4.0,
                  10.0,
                  4.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cone",
              "texturetransform" : [{"scale": [0.8,0.6,1]}],
              "texture": "roof",
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  50.0,
                  10.0,
                  -50.0
                ]
              },
              {
                "scale": [
                  50.0,
                  20.0,
                  10.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "box", 
              "texture": "brick",
              "texturetransform" : [{"scale": [1,3.9,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  47.5,
                  10.0,
                  -35.0
                ]
              },
              {
                "scale": [
                  15.0,
                  20.0,
                  20.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "box", 
              "texture": "brick",
              "texturetransform" : [{"scale": [1.8,1.4,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  47.5,
                  25.0,
                  -17.5
                ]
              },
              {
                "scale": [
                  15.0,
                  50.0,
                  15.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "box", 
              "texture": "brick",
              "texturetransform" : [{"scale": [5,1,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  47.5,
                  50.0,
                  -17.5
                ]
              },
              {
                "scale": [
                  7.5,
                  10.0,
                  7.5
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cylinder",
              "texture": "brick",
              "texturetransform" : [{"scale": [4,1.5,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  47.5,
                  60.0,
                  -17.5
                ]
              },
              {
                "scale": [
                  7.5,
                  10.0,
                  7.5
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cone",
              "texturetransform" : [{"scale": [2,1,1]}],
              "texture": "roof",
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  32.5,
                  10.0,
                  -5.0
                ]
              },
              {
                "scale": [
                  15.0,
                  20.0,
                  10.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "box", "texture": "brick",
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  60.0,
                  10.0,
                  -27.5
                ]
              },
              {
                "scale": [
                  10.0,
                  20.0,
                  35.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "box", 
              "texture": "brick",
              "texturetransform" : [{"scale": [3,0.8,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  70.0,
                  10.0,
                  -27.5
                ]
              },
              {
                "scale": [
                  10.0,
                  20.0,
                  15.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "box", 
              "texture": "brick",
              "texturetransform" : [{"scale": [1.5,1,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  70.0,
                  25.0,
                  -40.0
                ]
              },
              {
                "scale": [
                  10.0,
                  50.0,
                  10.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "box", 
              "texture": "brick",
              "texturetransform" : [{"scale": [5,1,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  70.0,
                  50.0,
                  -40.0
                ]
              },
              {
                "scale": [
                  5.0,
                  5.0,
                  5.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cylinder",
              "texturetransform" : [{"scale": [3,0.5,1]}],
              "texture": "brick",
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  70.0,
                  55.0,
                  -40.0
                ]
              },
              {
                "scale": [
                  5.0,
                  10.0,
                  5.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cone",
              "texture": "roof",
              "texturetransform" : [{"scale": [1.2,0.8,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  70.0,
                  25.0,
                  -15.0
                ]
              },
              {
                "scale": [
                  10.0,
                  50.0,
                  10.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "box", 
              "texture": "brick",
              "texturetransform" : [{"scale": [5,1,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  70.0,
                  50.0,
                  -15.0
                ]
              },
              {
                "scale": [
                  5.0,
                  5.0,
                  5.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cylinder",
              "texturetransform" : [{"scale": [3,0.5,1]}],
              "texture": "brick",
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  70.0,
                  55.0,
                  -15.0
                ]
              },
              {
                "scale": [
                  5.0,
                  10.0,
                  5.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cone",
              "texture": "roof",
              "texturetransform" : [{"scale": [1.2,0.8,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  80.0,
                  10.0,
                  -27.5
                ]
              },
              {
                "scale": [
                  10.0,
                  20.0,
                  35.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "box", "texture": "brick",
              "texturetransform" : [{"scale": [3,0.8,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  80.0,
                  25.0,
                  -50.0
                ]
              },
              {
                "scale": [
                  10.0,
                  50.0,
                  10.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "box", 
              "texture": "brick",
              "texturetransform" : [{"scale": [5,1,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  80.0,
                  50.0,
                  -50.0
                ]
              },
              {
                "scale": [
                  5.0,
                  5.0,
                  5.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cylinder",
              "texturetransform" : [{"scale": [3,0.5,1]}],
              "texture": "brick",
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  80.0,
                  55.0,
                  -50.0
                ]
              },
              {
                "scale": [
                  5.0,
                  10.0,
                  5.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cone",
              "texture": "roof",
              "texturetransform" : [{"scale": [1.2,0.8,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  80.0,
                  25.0,
                  -5.0
                ]
              },
              {
                "scale": [
                  10.0,
                  50.0,
                  10.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "box", 
              "texture": "brick",
              "texturetransform" : [{"scale": [5,1,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  80.0,
                  50.0,
                  -5.0
                ]
              },
              {
                "scale": [
                  5.0,
                  5.0,
                  5.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cylinder",
              "texturetransform" : [{"scale": [3,0.5,1]}],
              "texture": "brick",
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  80.0,
                  55.0,
                  -5.0
                ]
              },
              {
                "scale": [
                  5.0,
                  10.0,
                  5.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cone",
              "texture": "roof",
              "texturetransform" : [{"scale": [1.2,0.8,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  103.0,
                  10.0,
                  -27.0
                ]
              },
              {
                "scale": [
                  36.0,
                  20.0,
                  10.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "box", 
              "texture": "brick",
              "texturetransform" : [{"scale": [0.8,2.8,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  95.0,
                  10.0,
                  -50.0
                ]
              },
              {
                "scale": [
                  20.0,
                  20.0,
                  10.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "box", 
              "texture": "brick",
              "texturetransform" : [{"scale": [0.9,1.8,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  113.0,
                  0.0,
                  -50.0
                ]
              },
              {
                "scale": [
                  12.5,
                  40.0,
                  12.5
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cylinder",
              "texturetransform" : [{"scale": [4.5,3.5,1]}],
              "texture": "brick",
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  113.0,
                  40.0,
                  -50.0
                ]
              },
              {
                "scale": [
                  12.5,
                  50.0,
                  12.5
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cone",
              "texturetransform" : [{"scale": [2,2,1]}],
              "texture": "roof",
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  131.0,
                  10.0,
                  -50.0
                ]
              },
              {
                "scale": [
                  20.0,
                  20.0,
                  10.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "box", 
              "texture": "brick",
              "texturetransform" : [{"scale": [0.9,1.8,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  136.0,
                  25.0,
                  -42.0
                ]
              },
              {
                "scale": [
                  10.0,
                  50.0,
                  10.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "box", 
              "texture": "brick",
              "texturetransform" : [{"scale": [5,1,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  136.0,
                  50.0,
                  -42.0
                ]
              },
              {
                "scale": [
                  5.0,
                  5.0,
                  5.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cylinder",
              "texturetransform" : [{"scale": [3,0.5,1]}],
              "texture": "brick",
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  136.0,
                  55.0,
                  -42.0
                ]
              },
              {
                "scale": [
                  5.0,
                  10.0,
                  5.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cone",
              "texture": "roof",
              "texturetransform" : [{"scale": [1.2,0.8,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  126.0,
                  25.0,
                  -27.0
                ]
              },
              {
                "scale": [
                  10.0,
                  50.0,
                  10.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "box", 
              "texture": "brick",
              "texturetransform" : [{"scale": [5,1,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  126.0,
                  50.0,
                  -27.0
                ]
              },
              {
                "scale": [
                  5.0,
                  5.0,
                  5.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cylinder",
              "texturetransform" : [{"scale": [3,0.5,1]}],
              "texture": "brick",
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  126.0,
                  55.0,
                  -27.0
                ]
              },
              {
                "scale": [
                  5.0,
                  10.0,
                  5.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "cone",
              "texture": "roof",
              "texturetransform" : [{"scale": [1.2,0.8,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  136.0,
                  10.0,
                  -29.5
                ]
              },
              {
                "scale": [
                  10.0,
                  20.0,
                  15.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "box", 
              "texture": "brick",
              "texturetransform" : [{"scale": [1.2,0.8,1]}],
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "transform",
            "transform": [
              {
                "translate": [
                  12.5,
                  10.0,
                  -5.0
                ]
              },
              {
                "scale": [
                  5.0,
                  20.0,
                  10.0
                ]
              }
            ],
            "child": {
              "type": "object",
              "instanceof": "box",
              "texture" : "brick",
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          },
          {
            "type": "keyframe",
            "name": "plane",
            "keyframes": "models/camerapath.txt",
            "lights":[
              {
                "ambient": [
                  0.3,
                  0.3,
                  0   ],
                "diffuse": [
                  0.3,
                  0.3,
                  0
                ],
                "specular": [
                  0.3,
                  0.3,
                  0
                ],
                "position": [
                  0,
                  8,
                  0,
                  1.0
                ],
                "spotdirection": [
                  0.0,
                  1.0,
                  0,
                  0.0
                ],
                "spotcutoff": 22.0
              },
              {
                "ambient": [
                  0.3,
                  0,
                  0
                ], "diffuse": [
                  0.3,
                  0,
                  0
                ],
                "specular": [
                  0.3,
                  0,
                  0
                ],
                "position": [
                  10,
                  0,
                  0,
                  1.0
                ],
                "spotdirection": [
                  0.0,
                  1.0,
                  0,
                  0.0
                ],
                "spotcutoff": 22.0
              },
              {
                "ambient": [
                  0.3,
                  0,                  
                  0
                ],              
                "diffuse": [
                  0.3,
                  0,
                  0
                ],
                "specular": [
                  0.3,
                  0,
                  0
                ],
                "position": [
                  -10,
                  0,
                  0,
                  1.0
                ],
                "spotdirection": [
                  0.0,
                  1.0,
                  0,
                  0.0
                ],
                "spotcutoff": 22.0
              }
            ],
            "transform": [
              {"scale": [0.3, 0.3, 0.3]},
              {"rotate": [270, 1, 0, 0]}
            ],
            "child": {
              "type": "object",
              "instanceof": "aeroplane",
              "material": {
                "ambient": [
                  1,
                  1,
                  1
                ],
                "diffuse": [0.3, 0.3, 0.3],
                "specular": [0.2, 0.2, 0.2],
                "shininess": 10
              }
            }
          }
        ]
      }
    }`;
}

export function sphere() {
  return `{
      "scaleinstances": "false",
        "instances": [
          {
            "name": "sphere",
            "path": "models/sphere.obj"
          },
          {
            "name": "box",
            "path": "models/box-outside.obj"
          }
        ],
        "images": [
          {
            "name": "checkerboard",
            "path": "textures/checkerboard-box.png"
          },
          {
            "name": "earth",
            "path": "textures/earthmap.png"
          }
        ],
        "root": {
          "type": "group",
          "name": "Root of scene graph",
          "lights": [
            {
              "ambient": [
                0.8,
                0.8,
                0.8
              ],
              "diffuse": [
                0.8,
                0.8,
                0.8
              ],
              "specular": [
                0.8,
                0.8,
                0.8
              ],
              "position": [
                0.0,
                40.0,
                0.0,
                1.0
              ]
            }

          ],
          "children": [
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    -15,
                    0,
                    0
                  ]
                },
                {
                  "scale": [
                    10,
                    10,
                    10
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "sphere",
                "material": {
                  "ambient": [
                    1,
                    1,
                    1,
                    1.0
                  ],
                  "diffuse": [
                    0.8,
                    0.8,
                    0.8,
                    1.0
                  ],
                  "specular": [
                    0.8,
                    0.8,
                    0.8,
                    1.0
                  ],
                  "emission": [
                    0.0,
                    0.0,
                    0.0,
                    1.0
                  ],
                  "shininess": 1.0,
                  "absorption": 0.1,
                  "reflection": 0.9,
                  "transparency": 0.0,
                  "refractive_index": 0.0
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    15,
                    0,
                    0
                  ]
                },
                {
                  "scale": [
                    10,
                    10,
                    10
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "sphere",
                "material": {
                  "ambient": [
                    1,
                    1,
                    1,
                    1.0
                  ],
                  "diffuse": [
                    0.8,
                    0.8,
                    0.8,
                    1.0
                  ],
                  "specular": [
                    0.8,
                    0.8,
                    0.8,
                    1.0
                  ],
                  "emission": [
                    0.0,
                    0.0,
                    0.0,
                    1.0
                  ],
                  "shininess": 1.0,
                  "absorption": 0.2,
                  "reflection": 0.8,
                  "transparency": 0.0,
                  "refractive_index": 0.0
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    0,
                    -15,
                    0
                  ]
                },
                {
                  "scale": [
                    30.0,
                    2.0,
                    30.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "box",
                "material": {
                  "ambient": [
                    1,
                    1,
                    1,
                    1.0
                  ],
                  "diffuse": [
                    0.8,
                    0.8,
                    0.8,
                    1.0
                  ],
                  "specular": [
                    0.8,
                    0.8,
                    0.8,
                    1.0
                  ],
                  "emission": [
                    0.0,
                    0.0,
                    0.0,
                    1.0
                  ],
                  "shininess": 1.0,
                  "absorption": 0,
                  "reflection": 1,
                  "transparency": 0.0,
                  "refractive_index": 0.0
                }
              }
            }
          ]
        }
      }
      `;
}

export function box() {
  return `{
        "instances": [
          {
            "name": "sphere",
            "path": "models/sphere.obj"
          },
          {
            "name": "box",
            "path": "models/box-outside.obj"
          }
        ],
        "images": [
          {
            "name": "checkerboard",
            "path": "textures/checkerboard-box.png"
          },
          {
            "name": "earth",
            "path": "textures/earthmap.png"
          }
        ],
        "root": {
          "type": "group",
          "name": "Root of scene graph",
          "lights": [
            {
              "ambient": [
                0.8,
                0.8,
                0.8
              ],
              "diffuse": [
                0.8,
                0.8,
                0.8
              ],
              "specular": [
                0.8,
                0.8,
                0.8
              ],
              "position": [
                0.0,
                100.0,
                0.0,
                1.0
              ]
            }
          ],
          "children": [
            {
              "type": "transform",
              "transform": [
                {
                  "scale": [
                    10.0,
                    10.0,
                    10.0
                  ]
                },
                {
                  "rotate": [45,45,45, 0]
                }
              ],
              "child": {
                "type": "object",
                "texture": "checkerboard",
                "instanceof": "box",
                "material": {
                  "ambient": [
                    1,
                    1,
                    0,
                    1.0
                  ],
                  "diffuse": [
                    0.8,
                    0.8,
                    0.8,
                    1.0
                  ],
                  "specular": [
                    0.8,
                    0.8,
                    0.8,
                    1.0
                  ],
                  "emission": [
                    0.0,
                    0.0,
                    0.0,
                    1.0
                  ],
                  "shininess": 1.0,
                  "absorption": 1.0,
                  "reflection": 0.0,
                  "transparency": 0.0,
                  "refractive_index": 0.0
                }
              }
            }
          ]
        }
      }
      `;
}

export function cylinder() {
  return `{
      "scaleinstances": "false",
        "instances": [
          {
            "name": "cylinder",
            "path": "models/cylinder.obj"
          },
          {
            "name": "box",
            "path": "models/box.obj"
          }
        ],
        "images": [
          {
            "name": "checkerboard",
            "path": "textures/checkerboard.png"
          },
          {
            "name": "earth",
            "path": "textures/earthmap.png"
          }
        ],
        "root": {
          "type": "group",
          "name": "Root of scene graph",
          "lights": [
            {
              "ambient": [
                0.8,
                0.8,
                0.8
              ],
              "diffuse": [
                0.8,
                0.8,
                0.8
              ],
              "specular": [
                0.8,
                0.8,
                0.8
              ],
              "position": [
                0.0,
                100.0,
                0.0,
                1.0
              ],
              "spotdirection": [
                0.0,-1.0,0.0,0.0
              ],
              "spotcutoff": 20
            }

          ],
          "children": [
            {
              "type": "transform",
              "transform": [
                {
                  "scale": [
                    10.0,
                    10.0,
                    10.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cylinder",
                "material": {
                  "ambient": [
                    1,
                    1,
                    1,
                    1.0
                  ],
                  "diffuse": [
                    0.8,
                    0.8,
                    0.8,
                    1.0
                  ],
                  "specular": [
                    0.8,
                    0.8,
                    0.8,
                    1.0
                  ],
                  "emission": [
                    0.0,
                    0.0,
                    0.0,
                    1.0
                  ],
                  "shininess": 1.0,
                  "absorption": 1.0,
                  "reflection": 0.0,
                  "transparency": 0.0,
                  "refractive_index": 0.0
                }
              }
            }
          ]
        }
      }
      `;
}

export function cone() {
  return `{
      "scaleinstances": "false",
        "instances": [
          {
            "name": "cone",
            "path": "models/cone.obj"
          },
          {
            "name": "box",
            "path": "models/box.obj"
          }
        ],
        "images": [
          {
            "name": "checkerboard",
            "path": "textures/checkerboard.png"
          },
          {
            "name": "earth",
            "path": "textures/earthmap.png"
          }
        ],
        "root": {
          "type": "group",
          "name": "Root of scene graph",
          "lights": [
            {
              "ambient": [
                0.8,
                0.8,
                0.8
              ],
              "diffuse": [
                0.8,
                0.8,
                0.8
              ],
              "specular": [
                0.8,
                0.8,
                0.8
              ],
              "position": [
                0.0,
                100.0,
                0.0,
                1.0
              ],
              "spotdirection": [
                0.0,-1.0,0.0,0.0
              ],
              "spotcutoff": 20
            }

          ],
          "children": [
            {
              "type": "transform",
              "transform": [
                {
                  "scale": [
                    20.0,
                    20.0,
                    20.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cone",
                "material": {
                  "ambient": [
                    1,
                    1,
                    1,
                    1.0
                  ],
                  "diffuse": [
                    0.8,
                    0.8,
                    0.8,
                    1.0
                  ],
                  "specular": [
                    0.8,
                    0.8,
                    0.8,
                    1.0
                  ],
                  "emission": [
                    0.0,
                    0.0,
                    0.0,
                    1.0
                  ],
                  "shininess": 1.0,
                  "absorption": 1.0,
                  "reflection": 0.0,
                  "transparency": 0.0,
                  "refractive_index": 0.0
                }
              }
            }
          ]
        }
      }
      `;
}
