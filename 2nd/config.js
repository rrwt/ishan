const CONFIG = {
    child: {
        name: 'ISHAN',
        age: 2,
        ageText: 'DOS',
    },

    dates: {
        birthdayMoment: new Date('2025-12-31T12:38:00'),
        partyStart: new Date('2026-01-04T13:00:00'),
        partyEnd: new Date('2026-01-04T18:00:00'),
    },

    messages: {
        beforeBirthday: {
            preTitle: '¡Vroom Vroom!',
            subtitle: '¡cumple {ageText} años!',
        },
        afterBirthday: {
            preTitle: '¡Feliz cumpleaños!',
            subtitle: '¡cumplió {ageText} años!',
        },
        duringParty: [
            "🎉 ¡LA FIESTA ESTÁ EN MARCHA! 🎉",
            "🚗 ¡Vroom vroom! ¡Estamos celebrando! 🚗",
            "🎂 ¡{name} está soplando las velitas! 🎂",
            "🎈 ¡La diversión está al máximo! 🎈",
        ],
        duringPartySub: "Si no estás aquí... ¡date prisa! 🏃‍♂️💨",
        thankYou: {
            preTitle: '¡Gracias por celebrar con',
            subtitle: 'su {ordinal} cumpleaños!',
            heading: '🚗 ¡Fue una fiesta increíble! 🚗',
            body: 'Gracias a todos los que vinieron a celebrar con nosotros. ¡{name} se divirtió mucho con todos ustedes!',
            signature: 'Con cariño, la familia de {name} 🚜',
            footerText: '¡Hasta la próxima aventura! 🛣️',
        },
    },

    ordinal: 'segundo',
};

function formatMessage(template, data = {}) {
    const allData = {
        name: CONFIG.child.name,
        age: CONFIG.child.age,
        ageText: CONFIG.child.ageText,
        ordinal: CONFIG.ordinal,
        ...data
    };
    return template.replace(/\{(\w+)\}/g, (match, key) => {
        return allData[key] !== undefined ? allData[key] : match;
    });
}
