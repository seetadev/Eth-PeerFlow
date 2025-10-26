import React, { useState, useRef, useEffect } from "react";
import {
  IonPopover,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonAlert,
  IonToast,
  IonInput,
  IonButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonText,
} from "@ionic/react";
import {
  addOutline,
  arrowUndo,
  arrowRedo,
  ellipsisVertical,
  saveOutline,
  documentOutline,
  imageOutline,
  trashOutline,
  close,
  image,
  closeCircle,
  key,
  cameraOutline,
  createOutline,
  checkmark,
  logoBuffer,
  pencilOutline,
  colorPaletteOutline,
} from "ionicons/icons";
import * as AppGeneral from "../socialcalc/index.js";
import { File } from "../Storage/LocalStorage.js";
import { DATA } from "../../templates.js";
import { useInvoice } from "../../contexts/InvoiceContext.js";
import { formatDateForFilename } from "../../utils/helper.js";
import { useTheme } from "../../contexts/ThemeContext.js";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import {
  isQuotaExceededError,
  getQuotaExceededMessage,
} from "../../utils/helper.js";
import TemplateModal from "../TemplateModal/TemplateModal";

interface FileOptionsProps {
  showActionsPopover: boolean;
  setShowActionsPopover: (show: boolean) => void;
  showColorModal: boolean;
  setShowColorPicker: (show: boolean) => void;
  onSave?: () => Promise<void>;
  isAutoSaveEnabled?: boolean;
  fileName: string;
}

const FileOptions: React.FC<FileOptionsProps> = ({
  showActionsPopover,
  setShowActionsPopover,
  showColorModal,
  setShowColorPicker,
  onSave,
  isAutoSaveEnabled = false,
  fileName,
}) => {
  const { isDarkMode } = useTheme();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showSaveAsAlert, setShowSaveAsAlert] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [showLogoAlert, setShowLogoAlert] = useState(false);
  const [device] = useState(AppGeneral.getDeviceType());
  const actionsPopoverRef = useRef<HTMLIonPopoverElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Logo management state
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [savedLogos, setSavedLogos] = useState<
    Array<{ id: string; name: string; data: string }>
  >([]);

  // Signature modal state
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [savedSignatures, setSavedSignatures] = useState<
    Array<{ id: string; name: string; data: string }>
  >([]);

  // Template modal state
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const {
    selectedFile,
    store,
    billType,
    activeTemplateData,
    updateSelectedFile,
    updateBillType,
    resetToDefaults,
  } = useInvoice();

  // Helper function to trigger save if autosave is enabled
  const triggerAutoSave = async () => {
    if (isAutoSaveEnabled && onSave) {
      try {
        await onSave();
      } catch (error) {
        // Error handled
      }
    }
  };

  // Load saved logos and signatures on component mount
  useEffect(() => {
    loadSavedLogos();
    loadSavedSignatures();
  }, []);

  // Local storage functions for logos
  const loadSavedLogos = () => {
    try {
      const stored = localStorage.getItem("userLogos");
      if (stored) {
        const logos = JSON.parse(stored);
        setSavedLogos(logos);
      }
    } catch (error) {
      // Error handled
    }
  };

  // Logo management functions
  const handleAddLogo = () => {
    setShowActionsPopover(false);
    // Reload logos when opening the modal to get latest from localStorage
    loadSavedLogos();
    setShowLogoModal(true);
  };

  const handleSelectLogo = async (logo: {
    id: string;
    name: string;
    data: string;
  }) => {
    if (!activeTemplateData) {
      setToastMessage("No active template data available");
      setShowToast(true);
      return;
    }

    const logoCell = activeTemplateData.logoCell;
    const currentSheetId = activeTemplateData.msc.currentid;
    let logoCoordinate: string;

    if (typeof logoCell === "string") {
      logoCoordinate = logoCell;
    } else if (logoCell && logoCell[currentSheetId]) {
      logoCoordinate = logoCell[currentSheetId];
    } else {
      setToastMessage("Logo position not available for current sheet");
      setShowToast(true);
      return;
    }

    try {
      // Create coordinates object for the current sheet
      const logoCoordinates = {
        [currentSheetId]: logoCoordinate,
      };

      AppGeneral.addLogo(logoCoordinates, logo.data);
      setToastMessage(`Logo applied successfully!`);
      setShowToast(true);
      setShowLogoModal(false);

      // Trigger auto-save if enabled
      await triggerAutoSave();
    } catch (error) {
      // Error handled
      setToastMessage("Failed to apply logo");
      setShowToast(true);
    }
  };

  // Local storage functions for signatures
  const loadSavedSignatures = () => {
    try {
      const stored = localStorage.getItem("userSignatures");
      if (stored) {
        const signatures = JSON.parse(stored);
        setSavedSignatures(signatures);
      }
    } catch (error) {
      // Error handled
    }
  };

  const handleUndo = () => {
    AppGeneral.undo();
  };

  const handleRedo = () => {
    AppGeneral.redo();
  };

  const _validateName = (filename: string) => {
    if (!filename.trim()) {
      setToastMessage("File name cannot be empty");
      setShowToast(true);
      return false;
    }
    return true;
  };

  const _checkForExistingFile = async (filename: string) => {
    try {
      const existingFile = await store._checkKey(filename);
      if (existingFile) {
        setToastMessage("File already exists. Please choose a different name.");
        setShowToast(true);
        return true;
      }
      return false;
    } catch (error) {
      // Error handled
      return false;
    }
  };

  const doSaveAs = async (filename: string) => {
    try {
      // Validate the filename first
      if (!_validateName(filename)) {
        return;
      }

      // Check if file already exists
      const exists = await _checkForExistingFile(filename);
      if (exists) return;

      setToastMessage("Saving file...");
      setShowToast(true);

      // Get current file data to copy its structure
      const currentFile = await store._getFile(fileName || selectedFile);
      const content = AppGeneral.getSpreadsheetContent();
      const now = new Date().toISOString();
      if (!currentFile) {
        // Error handled
        setToastMessage("Error saving file!");
        setShowToast(true);
        return;
      }
      // Create new file with all structure from current file
      let data = {
        created: currentFile?.created || now,
        modified: now,
        content: encodeURIComponent(content),
        name: filename,
        billType: currentFile?.billType || billType || 1,
        isEncrypted: currentFile?.isEncrypted || false,
        templateId: currentFile?.templateId,
      };

      const file = new File(
        data.created,
        data.modified,
        data.content,
        data.name,
        data.billType,
        data.templateId,
        data.isEncrypted
      );
      // Error handled
      await store._saveFile(file);

      setToastMessage("File saved successfully!");
      setShowToast(true);
      // Redirect to the new file after a short delay
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = `/app/editor/${filename}`;
        link.click();
      }, 200);
    } catch (error) {
      // Error handled

      if (isQuotaExceededError(error)) {
        setToastMessage(getQuotaExceededMessage("saving file"));
      } else {
        setToastMessage("Failed to save file. Please try again.");
      }
      setShowToast(true);
    }
  };

  const handleSaveAs = () => {
    setShowActionsPopover(false);
    setNewFileName("");
    setShowSaveAsAlert(true);
  };

  const handleNewFileClick = () => {
    setShowActionsPopover(false);
    setShowTemplateModal(true);
  };

  const getCurrentSelectedCell = (): string | null => {
    // This would typically get the currently selected cell from the spreadsheet
    // For now, return a default cell
    return "A1";
  };

  const handleRemoveLogo = async () => {
    setShowActionsPopover(false);

    if (!activeTemplateData) {
      setToastMessage("No active template data available");
      setShowToast(true);
      return;
    }

    const logoCell = activeTemplateData.logoCell;
    const currentSheetId = activeTemplateData.msc.currentid;
    let logoCoordinate: string;

    if (typeof logoCell === "string") {
      logoCoordinate = logoCell;
    } else if (logoCell && logoCell[currentSheetId]) {
      logoCoordinate = logoCell[currentSheetId];
    } else {
      setToastMessage("Logo position not available for current sheet");
      setShowToast(true);
      return;
    }

    try {
      // Create coordinates object for the current sheet
      const logoCoordinates = {
        [currentSheetId]: logoCoordinate,
      };

      AppGeneral.removeLogo(logoCoordinates);
      setToastMessage("Logo removed successfully!");
      setShowToast(true);

      // Trigger auto-save if enabled
      await triggerAutoSave();
    } catch (error) {
      // Error handled
      setToastMessage("Failed to remove logo");
      setShowToast(true);
    }
  };

  const handleRemoveSignature = async () => {
    setShowActionsPopover(false);

    if (!activeTemplateData) {
      setToastMessage("No active template data available");
      setShowToast(true);
      return;
    }

    const signatureCell = activeTemplateData.signatureCell;
    const currentSheetId = activeTemplateData.msc.currentid;
    let signatureCoordinate: string;

    if (typeof signatureCell === "string") {
      signatureCoordinate = signatureCell;
    } else if (signatureCell && signatureCell[currentSheetId]) {
      signatureCoordinate = signatureCell[currentSheetId];
    } else {
      setToastMessage("Signature position not available for current sheet");
      setShowToast(true);
      return;
    }

    try {
      // Create coordinates object for the current sheet
      const signatureCoordinates = {
        [currentSheetId]: signatureCoordinate,
      };

      AppGeneral.removeLogo(signatureCoordinates);
      setToastMessage("Signature removed successfully!");
      setShowToast(true);

      // Trigger auto-save if enabled
      await triggerAutoSave();
    } catch (error) {
      // Error handled
      setToastMessage("Failed to remove signature");
      setShowToast(true);
    }
  };

  // Signature management functions
  const handleAddSignature = () => {
    setShowActionsPopover(false);
    // Reload signatures when opening the modal to get latest from localStorage
    loadSavedSignatures();
    setShowSignatureModal(true);
  };

  const handleSelectSignature = async (signature: {
    id: string;
    name: string;
    data: string;
  }) => {
    if (!activeTemplateData) {
      setToastMessage("No active template data available");
      setShowToast(true);
      return;
    }

    const signatureCell = activeTemplateData.signatureCell;
    const currentSheetId = activeTemplateData.msc.currentid;
    let signatureCoordinate: string;

    if (typeof signatureCell === "string") {
      signatureCoordinate = signatureCell;
    } else if (signatureCell && signatureCell[currentSheetId]) {
      signatureCoordinate = signatureCell[currentSheetId];
    } else {
      setToastMessage("Signature position not available for current sheet");
      setShowToast(true);
      return;
    }

    try {
      // Create coordinates object for the current sheet
      const signatureCoordinates = {
        [currentSheetId]: signatureCoordinate,
      };

      AppGeneral.addLogo(signatureCoordinates, signature.data);
      setToastMessage(`Signature applied successfully!`);
      setShowToast(true);
      setShowSignatureModal(false);

      // Trigger auto-save if enabled
      await triggerAutoSave();
    } catch (error) {
      // Error handled
      setToastMessage("Failed to apply signature");
      setShowToast(true);
    }
  };

  return (
    <>
      {/* Actions Popover */}
      <IonPopover
        ref={actionsPopoverRef}
        isOpen={showActionsPopover}
        onDidDismiss={() => setShowActionsPopover(false)}
        trigger="actions-trigger"
        side="end"
        alignment="end"
      >
        <IonContent>
          <IonList>
            <IonItem button onClick={handleNewFileClick}>
              <IonIcon icon={addOutline} slot="start" />
              <IonLabel>New</IonLabel>
            </IonItem>

            <IonItem button onClick={handleSaveAs}>
              <IonIcon icon={documentOutline} slot="start" />
              <IonLabel>Save As</IonLabel>
            </IonItem>

            <IonItem button onClick={handleUndo}>
              <IonIcon icon={arrowUndo} slot="start" />
              <IonLabel>Undo</IonLabel>
            </IonItem>

            <IonItem button onClick={handleRedo}>
              <IonIcon icon={arrowRedo} slot="start" />
              <IonLabel>Redo</IonLabel>
            </IonItem>

            <IonItem button onClick={() => setShowColorPicker(true)}>
              <IonIcon icon={colorPaletteOutline} slot="start" />
              <IonLabel>Sheet Colors</IonLabel>
            </IonItem>

            <IonItem button onClick={handleAddLogo}>
              <IonIcon icon={logoBuffer} slot="start" />
              <IonLabel>Apply Logo</IonLabel>
            </IonItem>

            <IonItem button onClick={handleAddSignature}>
              <IonIcon icon={pencilOutline} slot="start" />
              <IonLabel>Apply Signature</IonLabel>
            </IonItem>

            <IonItem button onClick={handleRemoveLogo}>
              <IonIcon icon={closeCircle} slot="start" />
              <IonLabel>Remove Logo</IonLabel>
            </IonItem>

            <IonItem button onClick={handleRemoveSignature}>
              <IonIcon icon={closeCircle} slot="start" />
              <IonLabel>Remove Signature</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonPopover>

      {/* Save As Alert */}
      <IonAlert
        isOpen={showSaveAsAlert}
        onDidDismiss={() => setShowSaveAsAlert(false)}
        header="Save As"
        inputs={[
          {
            name: "filename",
            type: "text",
            placeholder: "Enter filename",
            value: newFileName,
          },
        ]}
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "Save",
            handler: (data) => {
              if (data.filename?.trim()) {
                doSaveAs(data.filename.trim());
              }
            },
          },
        ]}
      />

      {/* Toast for notifications */}
      <IonToast
        isOpen={showToast}
        message={toastMessage}
        duration={3000}
        onDidDismiss={() => setShowToast(false)}
        position="bottom"
      />

      {/* Logo Modal */}
      <IonModal
        isOpen={showLogoModal}
        onDidDismiss={() => setShowLogoModal(false)}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Select Logo</IonTitle>
            <IonButton
              fill="clear"
              slot="end"
              onClick={() => setShowLogoModal(false)}
            >
              <IonIcon icon={close} />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Available Logos ({savedLogos.length})</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {savedLogos.length === 0 ? (
                <IonText color="medium">
                  <p>
                    No logos found. Please upload logos in the Settings page
                    first.
                  </p>
                </IonText>
              ) : (
                <IonGrid>
                  <IonRow>
                    {savedLogos.map((logo) => (
                      <IonCol key={logo.id} size="12" sizeMd="6">
                        <IonCard>
                          <IonCardContent>
                            <IonImg
                              src={logo.data}
                              alt={logo.name}
                              style={{
                                maxHeight: "100px",
                                objectFit: "contain",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                padding: "8px",
                                backgroundColor: "white",
                              }}
                            />
                            <IonButton
                              expand="block"
                              fill="solid"
                              color="primary"
                              onClick={() => handleSelectLogo(logo)}
                            >
                              <IonIcon icon={checkmark} slot="start" />
                              Apply Logo
                            </IonButton>
                          </IonCardContent>
                        </IonCard>
                      </IonCol>
                    ))}
                  </IonRow>
                </IonGrid>
              )}
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonModal>

      {/* Signature Modal */}
      <IonModal
        isOpen={showSignatureModal}
        onDidDismiss={() => setShowSignatureModal(false)}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Select Signature</IonTitle>
            <IonButton
              fill="clear"
              slot="end"
              onClick={() => setShowSignatureModal(false)}
            >
              <IonIcon icon={close} />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                Available Signatures ({savedSignatures.length})
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {savedSignatures.length === 0 ? (
                <IonText color="medium">
                  <p>
                    No signatures found. Please create signatures in the
                    Settings page first.
                  </p>
                </IonText>
              ) : (
                <IonGrid>
                  <IonRow>
                    {savedSignatures.map((signature) => (
                      <IonCol key={signature.id} size="12" sizeMd="6">
                        <IonCard>
                          <IonCardContent>
                            <IonImg
                              src={signature.data}
                              alt={signature.name}
                              style={{
                                maxHeight: "100px",
                                objectFit: "contain",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                padding: "8px",
                                backgroundColor: "white",
                              }}
                            />
                            <IonButton
                              expand="block"
                              fill="solid"
                              color="primary"
                              onClick={() => handleSelectSignature(signature)}
                            >
                              <IonIcon icon={checkmark} slot="start" />
                              Apply Signature
                            </IonButton>
                          </IonCardContent>
                        </IonCard>
                      </IonCol>
                    ))}
                  </IonRow>
                </IonGrid>
              )}
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonModal>

      {/* Template Modal */}
      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onFileCreated={(fileName, templateId) => {
          setToastMessage(`File "${fileName}" created successfully!`);
          setShowToast(true);
        }}
      />
    </>
  );
};

export default FileOptions;
