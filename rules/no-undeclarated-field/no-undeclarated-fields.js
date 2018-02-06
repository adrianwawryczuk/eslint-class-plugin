const searchedProperties = ["ClassProperty", "MethodDefinition"];

export function undeclaratedClassFields(context) {
    const classProperties = new Map();

    return {
        ClassDeclaration(node) {
            classProperties.set(node.id.name, {
                declared: getClassProperties(node),
                used: new Map()
            });
        },

        MemberExpression(node) {
            const className = getClassName();

            if (node.object.type === "ThisExpression" && node.property) {
                classProperties.get(className).used.set(node.property.name, node.property);
            }
        },

        "Program:exit"() {
            classProperties.forEach((classNode, className) => {
                classNode.used.forEach(usedProperty => {
                    if (!classNode.declared.has(usedProperty.name)) {
                        context.report(usedProperty, `Undeclared field in class ${className}`);
                    }
                });
            });
        }
    };

    function getClassProperties(node) {
        const properties = new Map();

        let nextClass = node.body.body;
        for (const classProperty of nextClass) {
            if (searchedProperties.includes(classProperty.type)) {
                properties.set(classProperty.key.name, classProperty);
            }
        }

        if (node.superClass) {
            const superClassProperties = classProperties.get(node.superClass.name).declared;

            for (const property of superClassProperties) {
                properties.set(property[0], property[1]);
            }
        }

        return properties;
    }

    function getClassName(node) {
        let name = "";
        context.getAncestors(node).forEach(ancestor => {
            if (ancestor.type === "ClassDeclaration") {
                name = ancestor.id.name;
            }
        });

        return name;
    }
}