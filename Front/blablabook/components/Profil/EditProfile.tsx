/* eslint-disable react/no-unescaped-entities */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { editProfileSchema } from "@/lib/validator.schema";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateProfileAction } from "@/lib/actions/user.action";
import { Toast, useToast } from "@/components/Toast";
import Link from "next/link";
import { getUploadUrl } from "@/lib/utils";
import ProfileImageDropzone from "./ProfileImageDropzone";
import DeleteConfirmation from "./DeleteConfirmation";
import { signOut, useSession } from "next-auth/react";
import { removeUser } from "@/lib/actions/backoffice.action";

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export default function EditProfile({
  userId,
  initialData,
}: {
  userId: number;
  initialData: EditProfileFormData;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { update } = useSession();
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData.profilePicture
      ? getUploadUrl(initialData.profilePicture)
      : null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: initialData.username || "",
      description: initialData.description || "",
      profilePicture: initialData.profilePicture || "",
      isPrivate: initialData.isPrivate || false,
    },
  });

  const profilePictureUrl = watch("profilePicture");
  const descriptionValue = watch("description");
  const displayProfilePicture =
    previewUrl ||
    (profilePictureUrl
      ? profilePictureUrl.startsWith("data:")
        ? profilePictureUrl
        : getUploadUrl(profilePictureUrl)
      : null);

  // Nettoyer les object URLs pour éviter les fuites mémoire
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast("Veuillez sélectionner une image", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("L'image ne doit pas dépasser 5 MB", "error");
      return;
    }

    // Nettoyer l'ancien preview s'il existe
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    // Stocker le fichier pour l'envoyer avec le formulaire
    setSelectedFile(file);

    // Créer un aperçu local sans charger en base64
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Conserver la valeur actuelle du champ (chemin existant) pour la validation
    setValue(
      "profilePicture",
      profilePictureUrl || initialData.profilePicture || "",
    );

    showToast("Image sélectionnée", "success");
  };

  const handleClearPicture = () => {
    setValue("profilePicture", "");
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const onSubmit = async (data: EditProfileFormData) => {
    setIsLoading(true);
    try {
      // Passer le fichier à l'action (sera uploadé en même temps que les autres données)
      const response = await updateProfileAction(userId, data, selectedFile);

      if (!response?.success) {
        showToast(
          response?.error || "Une erreur est survenue lors de la mise à jour.",
          "error",
        );
        return;
      }

      showToast("Profil mis à jour avec succès !", "success");

      // Update the client-side JWT token with the new profile data
      await update({
        username: data.username,
        profilePicture: response.data?.profilePicture ?? data.profilePicture ?? null,
        isPrivate: data.isPrivate,
      });

      setTimeout(() => {
        router.push("/mon-profil");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      showToast("Une erreur est survenue. Veuillez réessayer.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await removeUser(userId);
      if (!response?.success) {
        showToast(
          response?.error ||
            "Une erreur est survenue lors de la suppression du compte.",
          "error",
        );
        return;
      }
      await signOut({ redirect: false });
      showToast("Compte supprimé avec succès", "success");
      router.push("/");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      showToast("Une erreur est survenue. Veuillez réessayer.", "error");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={hideToast}
        />
      )}
      <div className="w-full mx-auto">
        <div className="bg-linear-to-r from-quater/5 to-primary/5 rounded-t-md p-6 border-b border-quater/10">
          <h1 className="text-2xl font-bold font-one text-quater mb-1">
            Modifier mon profil
          </h1>
          <p className="text-gray-600 text-xs">
            Mettez à jour vos informations personnelles
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-b-md"
        >
          <div className="p-6 space-y-6">
            {/* Photo de profil section */}
            <ProfileImageDropzone
              displayUrl={displayProfilePicture}
              hasValue={!!profilePictureUrl}
              onFileSelected={handleFileUpload}
              onClear={handleClearPicture}
              errorMessage={errors.profilePicture?.message}
            />

            {/* Infos personnelles section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-gray-100">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-xs font-semibold text-quater mb-2"
                >
                  <span className="material-icons inline-block mr-1 align-text-bottom text-base">
                    person
                  </span>
                  Nom d'utilisateur
                </label>
                <input
                  {...register("username")}
                  type="text"
                  id="username"
                  className={`text-noir text-sm w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-quater/50 transition ${
                    errors.username
                      ? "border-red-500"
                      : "border-gray-200 hover:border-quater/30"
                  }`}
                  placeholder="Votre nom d'utilisateur"
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="material-icons text-xs">error</span>
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Statut privé */}
              <div className="flex flex-col justify-end">
                <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-quater/30 cursor-pointer transition bg-gray-50/50">
                  <input
                    {...register("isPrivate")}
                    type="checkbox"
                    className="w-4 h-4 text-quater rounded cursor-pointer"
                  />
                  <span className="ml-2 font-medium text-quater text-sm flex items-center gap-1">
                    <span className="material-icons text-base">lock</span>
                    Profil privé
                  </span>
                </label>
              </div>
            </div>

            {/* Description section */}
            <div className="pb-6">
              <label
                htmlFor="description"
                className="block text-xs font-semibold text-quater mb-2"
              >
                <span className="material-icons inline-block mr-1 align-text-bottom text-base">
                  description
                </span>
                À propos de moi
              </label>
              <textarea
                {...register("description")}
                id="description"
                rows={4}
                className={`text-noir text-sm w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-quater/50 transition resize-none ${
                  errors.description
                    ? "border-red-500"
                    : "border-gray-200 hover:border-quater/30"
                }`}
                placeholder="Parlez-nous de vous, vos passions, vos lectures préférées..."
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span className="material-icons text-xs">error</span>
                  {errors.description.message}
                </p>
              )}
              <div className="flex justify-between items-center mt-1">
                <p className="text-gray-500 text-xs">Maximum 500 caractères</p>
                <p
                  className={`text-xs font-medium ${
                    descriptionValue && descriptionValue.length > 450
                      ? "text-orange-500"
                      : "text-gray-400"
                  }`}
                >
                  {descriptionValue?.length || 0}/500
                </p>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-3 pt-3 border-t border-gray-100">
              <Link
                href="/mon-profil"
                className="flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <span className="material-icons text-base">close</span>
                Annuler
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`cursor-pointer flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 text-white ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90  shadow-lg hover:shadow-xl"
                }`}
              >
                <span className="material-icons text-base">
                  {isSubmitting || isLoading ? "hourglass_empty" : "save"}
                </span>
                {isSubmitting || isLoading ? "Mise à jour..." : "Enregistrer"}
              </button>
            </div>

            {/* Zone de danger */}
            <div className="pt-6 border-t border-red-200">
              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <span className="material-icons text-base">warning</span>
                  Zone de danger
                </h3>
                <p className="text-xs text-red-600 mb-3">
                  La suppression de votre compte est définitive et irréversible.
                </p>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="w-full sm:w-auto py-2 px-4 rounded-lg font-medium text-sm transition-colors bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <span className="material-icons text-base">
                    delete_forever
                  </span>
                  Supprimer mon compte
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmation
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteAccount}
          isDeleting={isDeleting}
        />
      </div>
    </>
  );
}
