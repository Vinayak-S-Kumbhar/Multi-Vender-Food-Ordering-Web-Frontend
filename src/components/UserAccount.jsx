import styles from "./cssFolder/UserAccount.module.css";
import { assets } from "../assets/assets.js";

export default function UserAccount({ AccountOpen, onClose }) {
  return !AccountOpen ? null : (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>

        {/* Left Sidebar */}
        <div className={styles.sidebar}>
          <h2>Account</h2>
          <p className={styles.subtitle}>Manage your account info.</p>

          <div className={styles.navItemActive}>👤 Profile</div>
          <div className={styles.navItem}>🔒 Security</div>

          <div className={styles.footer}>
            Secured by <span>clerk</span>
            <div className={styles.devMode}>Development mode</div>
          </div>
        </div>

        {/* Right Content */}
        <div className={styles.content}>
          <h3 className={styles.sectionTitle}>Profile details</h3>

          <div className={styles.profileSection}>
            <div className={styles.profileLabel}>Profile</div>

            <div className={styles.updateCard}>
              <h4>Update profile</h4>

              <div className={styles.updateRow}>
                <div className={styles.avatar}>
                  <img
                    className={styles.avatarImage}
                    src={assets.profile_picture}
                    alt="Profile"
                  />
                </div>

                <div className={styles.actions}>
                  <div className={styles.uploadRow}>
                    <button className={styles.uploadBtn}>Upload</button>
                    <button className={styles.removeBtn}>Remove</button>
                  </div>
                  <p className={styles.hint}>
                    Recommended size 1:1, up to 10MB.
                  </p>
                </div>
              </div>

              <div className={styles.cardActions}>
                <button className={styles.cancelBtn}>Cancel</button>
                <button className={styles.saveBtn}>Save</button>
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.infoRow}>
            <div>
              <strong>Email addresses</strong>
            </div>
            <div className={styles.emailRight}>
              user.greatstack@gmail.com
              <span className={styles.badge}>Primary</span>
            </div>
          </div>

          <div className={styles.addEmail}>+ Add email address</div>

          <div className={styles.divider} />

          <div className={styles.infoRow}>
            <strong>Connected accounts</strong>
            <div>Google · user.greatstack@gmail.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
