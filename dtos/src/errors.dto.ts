export enum HttpErrors {
  EXISTING_CURRENT_NEWS = "Il existe déja une actualité en cours",
  NEWS_CANNOT_START_IN_PAST = "Les actualités ne peuvent commencer dans le passé",
  NEWS_CANNOT_FINISH_IN_PAST = "Les actualités ne peuvent finir dans le passé",
  NEWS_CANNOT_START_BEFORE_END_OF_CURRENT = "Les actualités plannifiées ne peuvent commencer avant la fin de l'actualité en cours",
  ONLY_ONE_CURRENT_NEWS_AUTHORIZED = "Seulement une actualité en cours est autorisé",
  ONLY_ONE_PLANNED_NEWS_AUTHORIZED = "Seulement une actualité planifiée est autorisé",
  NEWS_NOT_FOUND = "Actualité non trouvée",
  AUTH_INVALID_TOKEN = "Token d'authentification invalide",
  ENDDATE_CANNOT_START_BEFORE_STARTDATE = "La date de fin ne peut être avant la date de début",
  NEWS_CANNOT_START_SAME_AS_PLANNED = "L'actualité en cours ne peut commencer en même temps que l'actualité plannifée",
  POLLEN_NOT_FOUND = "Pollen non trouvé",
  POLLEN_NOTIFICATION_DTO_FAILED = "Une update nécessite de renseigner le fcm token et un status",
}
